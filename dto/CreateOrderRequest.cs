namespace QCardPayment.dto;

public class CreateOrderRequest
{
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
}
