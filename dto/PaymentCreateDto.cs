namespace QCardPayment.dto;

public class PaymentCreateDto
{
    public int OrderId { get; set; }
    public string RequestId { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string FormUrl { get; set; } = string.Empty;
}
