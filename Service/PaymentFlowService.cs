using Microsoft.Extensions.Options;
using QCardPayment.Constants;
using QCardPayment.DataBase;
using QCardPayment.dto;
using QCardPayment.Integration.QiCard;
using QCardPayment.Integration.QiCard.Dtos;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Service;

/// <summary>
/// تنفيذ سيناريو الدفع من اختيار المنتجات حتى إتمام الدفع
/// هذه الخدمة هي نقطة الربط بين نظامك وبوابة Qi Card
/// </summary>
public class PaymentFlowService : IPaymentFlowService
{
    private readonly DataContext _db;
    private readonly IProductRepository _productRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IQiCardService _qiCardService;
    private readonly QiCardOptions _qiCardOptions;

    public PaymentFlowService(
        DataContext db,
        IProductRepository productRepository,
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        IQiCardService qiCardService,
        IOptions<QiCardOptions> qiCardOptions)
    {
        _db = db;
        _productRepository = productRepository;
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _qiCardService = qiCardService;
        _qiCardOptions = qiCardOptions.Value;
    }

    /// <inheritdoc />
    public async Task<CheckoutResponse> CheckoutAsync(
        string userId,
        CheckoutRequest request,
        CancellationToken ct = default)
    {
        if (request.Items is null || request.Items.Count == 0)
            throw new InvalidOperationException("يجب اختيار منتج واحد على الأقل.");

        // ── الخطوة 1: التحقق من المنتجات وحساب المجموع ──
        var orderItems = new List<OrderItems>();
        decimal total = 0;

        foreach (var item in request.Items)
        {
            if (item.Quantity <= 0)
                throw new InvalidOperationException($"الكمية غير صالحة للمنتج {item.ProductId}.");

            var product = await _productRepository.GetByIdAsync(item.ProductId)
                ?? throw new InvalidOperationException($"المنتج {item.ProductId} غير موجود.");

            if (!product.IsActive)
                throw new InvalidOperationException($"المنتج '{product.Name}' غير متوفر حالياً.");

            var lineTotal = product.Price * item.Quantity;
            total += lineTotal;

            orderItems.Add(new OrderItems
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        if (total < 0.01m)
            throw new InvalidOperationException("مبلغ الطلب يجب أن يكون أكبر من صفر.");

        // ── الخطوة 2: إنشاء الطلب في قاعدة البيانات ──
        var order = new Orders
        {
            UserId = userId,
            TotalAmount = total,
            Status = OrderStatuses.AwaitingPayment,
            Items = orderItems
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);

        // ── الخطوة 3: إنشاء عملية دفع عند Qi Card ──
        var requestId = Guid.NewGuid().ToString();

        var qiRequest = new QiCardCreatePaymentRequest
        {
            RequestId = requestId,
            Amount = total,
            Currency = _qiCardOptions.Currency,
            Locale = _qiCardOptions.Locale,
            FinishPaymentUrl = BuildFinishUrl(order.Id),
            NotificationUrl = _qiCardOptions.NotificationUrl,
            AdditionalInfo = new Dictionary<string, string>
            {
                ["orderId"] = order.Id.ToString()
            }
        };

        var qiResponse = await _qiCardService.CreatePaymentAsync(qiRequest, ct);

        // ── الخطوة 4: حفظ بيانات الدفع محلياً ──
        var payment = new Payments
        {
            OrderId = order.Id,
            RequestId = qiResponse.RequestId,
            PaymentId = qiResponse.PaymentId,
            Amount = qiResponse.Amount,
            Status = qiResponse.Status,
            FormUrl = qiResponse.FormUrl
        };

        var savedPayment = await _paymentRepository.AddAsync(payment);

        return new CheckoutResponse
        {
            OrderId = order.Id,
            PaymentId = savedPayment.Id,
            RequestId = savedPayment.RequestId,
            QiCardPaymentId = savedPayment.PaymentId,
            Amount = savedPayment.Amount,
            Status = savedPayment.Status,
            FormUrl = savedPayment.FormUrl
        };
    }

    /// <inheritdoc />
    public async Task HandleWebhookAsync(QiCardPaymentResponse notification, CancellationToken ct = default)
    {
        // Qi Card ترسل Payment object عند اكتمال الدفع
        var payment = await _paymentRepository.GetByRequestIdAsync(notification.RequestId)
            ?? await _paymentRepository.GetByQiCardPaymentIdAsync(notification.PaymentId);

        if (payment is null)
            return;

        await ApplyPaymentStatusAsync(payment, notification.Status, ct);
    }

    /// <inheritdoc />
    public async Task<Payments?> SyncPaymentStatusAsync(int paymentId, CancellationToken ct = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment is null || string.IsNullOrWhiteSpace(payment.PaymentId))
            return null;

        var status = await _qiCardService.GetPaymentStatusAsync(payment.PaymentId, ct);
        await ApplyPaymentStatusAsync(payment, status.Status, ct);

        return await _paymentRepository.GetByIdAsync(paymentId);
    }

    // ─── تحديث حالة الدفع والطلب بناءً على استجابة Qi ───────────────

    private async Task ApplyPaymentStatusAsync(Payments payment, string qiStatus, CancellationToken ct)
    {
        payment.Status = qiStatus;
        await _paymentRepository.UpdateAsync(payment);

        var order = await _orderRepository.GetByIdAsync(payment.OrderId);
        if (order is null)
            return;

        order.Status = MapQiStatusToOrderStatus(qiStatus);
        await _orderRepository.UpdateAsync(order);
    }

    private static string MapQiStatusToOrderStatus(string qiStatus) => qiStatus switch
    {
        QiCardPaymentStatuses.Success => OrderStatuses.Paid,
        QiCardPaymentStatuses.Failed or QiCardPaymentStatuses.AuthenticationFailed => OrderStatuses.Failed,
        _ => OrderStatuses.AwaitingPayment
    };

    private string BuildFinishUrl(int orderId)
    {
        var baseUrl = _qiCardOptions.FinishPaymentUrl.TrimEnd('/');
        return $"{baseUrl}?orderId={orderId}";
    }
}
