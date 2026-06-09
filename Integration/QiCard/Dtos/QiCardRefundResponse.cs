namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// استجابة طلب الاسترداد
/// </summary>
public class QiCardRefundResponse
{
    public string RefundId { get; set; } = string.Empty;
    public string? RequestId { get; set; }
    public string PaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime? CreationDate { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool Canceled { get; set; }
}
