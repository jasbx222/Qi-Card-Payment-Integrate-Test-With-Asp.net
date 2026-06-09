namespace QCardPayment.dto;

/// <summary>
/// طلب إتمام الشراء: اختيار منتجات وبدء الدفع
/// </summary>
public class CheckoutRequest
{
    /// <summary>قائمة المنتجات المختارة مع الكمية</summary>
    public List<CheckoutItemRequest> Items { get; set; } = new();
}

public class CheckoutItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
