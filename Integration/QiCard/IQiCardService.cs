using QCardPayment.Integration.QiCard.Dtos;

namespace QCardPayment.Integration.QiCard;

/// <summary>
/// واجهة خدمة Qi Card - انسخ هذا الملف مع التنفيذ لأي مشروع جديد
/// تغطي جميع endpoints الموجودة في Postman Collection
/// </summary>
public interface IQiCardService
{
    /// <summary>POST /payment - إنشاء عملية دفع جديدة</summary>
    Task<QiCardPaymentResponse> CreatePaymentAsync(QiCardCreatePaymentRequest request, CancellationToken ct = default);

    /// <summary>GET /payment/{paymentId} - جلب نموذج الدفع (HTML)</summary>
    Task<string> GetPaymentFormAsync(string paymentId, CancellationToken ct = default);

    /// <summary>GET /payment/{paymentId}/status - استعلام حالة الدفع</summary>
    Task<QiCardPaymentStatusResponse> GetPaymentStatusAsync(string paymentId, CancellationToken ct = default);

    /// <summary>GET /payment/status/by/request/{requestId} - استعلام بالـ RequestId</summary>
    Task<QiCardPaymentStatusResponse> GetPaymentStatusByRequestIdAsync(string requestId, CancellationToken ct = default);

    /// <summary>POST /payment/{paymentId}/cancel - إلغاء الدفع</summary>
    Task<QiCardPaymentResponse> CancelPaymentAsync(string paymentId, QiCardCancelPaymentRequest request, CancellationToken ct = default);

    /// <summary>POST /payment/cancel/by/request/{requestId} - إلغاء بالـ RequestId</summary>
    Task<QiCardPaymentResponse> CancelPaymentByRequestIdAsync(string requestId, QiCardCancelPaymentRequest request, CancellationToken ct = default);

    /// <summary>POST /payment/{paymentId}/refund - استرداد مبلغ</summary>
    Task<QiCardRefundResponse> RefundPaymentAsync(string paymentId, QiCardRefundRequest request, CancellationToken ct = default);

    /// <summary>POST /payment/refund/by/request/{requestId} - استرداد بالـ RequestId</summary>
    Task<QiCardRefundResponse> RefundPaymentByRequestIdAsync(string requestId, QiCardRefundRequest request, CancellationToken ct = default);
}
