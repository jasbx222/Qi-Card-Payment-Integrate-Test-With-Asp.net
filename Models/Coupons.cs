namespace QCardPayment.Models;

public class Coupons
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "percent";
    public decimal Value { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int? MaxUses { get; set; }
    public int UsedCount { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
}
