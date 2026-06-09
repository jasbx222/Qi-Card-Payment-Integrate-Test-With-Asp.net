namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// استجابة استعلام حالة الدفع
/// </summary>
public class QiCardPaymentStatusResponse
{
    public string RequestId { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool Canceled { get; set; }
    public decimal Amount { get; set; }
    public decimal? ConfirmedAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? PaymentType { get; set; }
    public DateTime? CreationDate { get; set; }
    public QiCardPaymentDetails? Details { get; set; }
}

public class QiCardPaymentDetails
{
    public string? ResultCode { get; set; }
    public string? Rrn { get; set; }
    public string? AuthId { get; set; }
    public string? AuthDate { get; set; }
    public string? MaskedPan { get; set; }
    public string? PaymentSystem { get; set; }
}
