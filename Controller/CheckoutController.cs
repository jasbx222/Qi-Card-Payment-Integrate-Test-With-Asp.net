using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.dto;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.Service;

namespace QCardPayment.Controller;

/// <summary>
/// سيناريو الشراء والدفع الإلكتروني الكامل
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CheckoutController : ControllerBase
{
    private readonly IPaymentFlowService _paymentFlowService;
    private readonly IOrderRepository _orderRepository;

    public CheckoutController(
        IPaymentFlowService paymentFlowService,
        IOrderRepository orderRepository)
    {
        _paymentFlowService = paymentFlowService;
        _orderRepository = orderRepository;
    }

    /// <summary>
    /// إتمام الشراء: إنشاء طلب + بدء دفع Qi Card
    /// الخطوة التالية: وجّه العميل إلى FormUrl في الاستجابة
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "يجب تسجيل الدخول أولاً." });

        try
        {
            var result = await _paymentFlowService.CheckoutAsync(userId, request, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { message = "فشل الاتصال ببوابة الدفع.", details = ex.Message });
        }
    }

    /// <summary>
    /// صفحة إعادة التوجيه بعد الدفع (FinishPaymentUrl)
    /// Qi Card تعيد توجيه العميل هنا بعد إتمام العملية
    /// </summary>
    [HttpGet("finish")]
    [AllowAnonymous]
    public async Task<IActionResult> Finish([FromQuery] int orderId, CancellationToken ct)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order is null)
            return NotFound(new { message = "الطلب غير موجود." });

        // مزامنة آخر حالة من Qi Card إن وُجد دفع
        var latestPayment = order.Payments.OrderByDescending(p => p.Id).FirstOrDefault();
        if (latestPayment is not null)
            await _paymentFlowService.SyncPaymentStatusAsync(latestPayment.Id, ct);

        order = await _orderRepository.GetByIdAsync(orderId);

        return Ok(new
        {
            message = "تمت معالجة الدفع. راجع حالة الطلب أدناه.",
            orderId = order!.Id,
            orderStatus = order.Status,
            totalAmount = order.TotalAmount,
            payments = order.Payments.Select(p => new
            {
                p.Id,
                p.Status,
                p.Amount,
                p.FormUrl
            })
        });
    }
}
