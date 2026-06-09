namespace QCardPayment.Models;

public class Orders
{
    public int Id { get; set; }

    /// <summary>معرّف المستخدم (من Identity)</summary>
    public string UserId { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;

    public ICollection<OrderItems> Items { get; set; } = new List<OrderItems>();
    public ICollection<Payments> Payments { get; set; } = new List<Payments>();
}