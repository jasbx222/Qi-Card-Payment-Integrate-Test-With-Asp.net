using QCardPayment.dto;
using QCardPayment.Integration.QiCard.Dtos;
using QCardPayment.Models;

namespace QCardPayment.Service;

/// <summary>
/// خدمة تنسيق سيناريو الدفع الكامل: طلب → Qi Card → تحديث الحالة
/// </summary>
public interface IPaymentFlowService
{
    /// <summary>
    /// السيناريو الكامل: إنشاء طلب من المنتجات ثم بدء الدفع الإلكتروني
    /// </summary>
    Task<CheckoutResponse> CheckoutAsync(string userId, CheckoutRequest request, CancellationToken ct = default);

    /// <summary>
    /// معالجة إشعار Webhook من Qi Card وتحديث حالة الطلب
    /// </summary>
    Task HandleWebhookAsync(QiCardPaymentResponse notification, CancellationToken ct = default);

    /// <summary>
    /// استعلام حالة الدفع من Qi Card وتحديث قاعدة البيانات
    /// </summary>
    Task<Payments?> SyncPaymentStatusAsync(int paymentId, CancellationToken ct = default);
}
