namespace QCardPayment.Models;

public class Orders
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;

    public ICollection<Payments> Payments { get; set; } = new List<Payments>();
}