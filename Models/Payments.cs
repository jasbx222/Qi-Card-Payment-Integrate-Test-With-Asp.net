using System.Text.Json.Serialization;

namespace QCardPayment.Models;

public class Payments
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string RequestId { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string FormUrl { get; set; } = string.Empty;

    [JsonIgnore]
    public Orders? Order { get; set; }
}


