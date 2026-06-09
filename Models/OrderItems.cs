namespace QCardPayment.Models;

/// <summary>
/// عنصر داخل الطلب (منتج + كمية)
/// </summary>
public class OrderItems
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public Orders? Order { get; set; }
    public Products? Product { get; set; }
}
