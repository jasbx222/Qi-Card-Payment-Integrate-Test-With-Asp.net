namespace QCardPayment.Models;

/// <summary>
/// منتج في المتجر - مثال يمكن استبداله بجدول منتجات نظامك
/// </summary>
public class Products
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}
