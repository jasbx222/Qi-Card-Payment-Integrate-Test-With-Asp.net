namespace QCardPayment.dto;

public class CreateOrderRequest
{
    public string UserId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
}
