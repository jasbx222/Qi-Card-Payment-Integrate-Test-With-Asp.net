namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// استجابة Qi Card عند إنشاء/استعلام/إشعار الدفع
/// </summary>
public class QiCardPaymentResponse
{
    public string RequestId { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool Canceled { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime? CreationDate { get; set; }

    /// <summary>رابط صفحة الدفع - وجّه العميل إليه في المتصفح</summary>
    public string FormUrl { get; set; } = string.Empty;

    public Dictionary<string, string>? AdditionalInfo { get; set; }
}
