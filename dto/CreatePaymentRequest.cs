namespace QCardPayment.dto;
public class CreatePaymentRequest
{
    public string RequestId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string FinishPaymentUrl { get; set; }
    public string NotificationUrl { get; set; }
}