namespace QCardPayment.dto;

/// <summary>
/// نتيجة عملية الشراء - يحتوي رابط صفحة الدفع
/// </summary>
public class CheckoutResponse
{
    public int OrderId { get; set; }
    public int PaymentId { get; set; }
    public string RequestId { get; set; } = string.Empty;
    public string QiCardPaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;

    /// <summary>وجّه العميل لهذا الرابط لإدخال بيانات البطاقة</summary>
    public string FormUrl { get; set; } = string.Empty;
}
