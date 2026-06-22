namespace QCardPayment.dto;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
}

public class ProductCreateUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int StockQuantity { get; set; } = 100;
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public int? CategoryId { get; set; }
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
}

public class CategoryCreateUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CouponDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "percent";
    public decimal Value { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int? MaxUses { get; set; }
    public int UsedCount { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; }
}

public class CouponCreateUpdateDto
{
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "percent";
    public decimal Value { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int? MaxUses { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
}

public class BannerDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaLink { get; set; } = string.Empty;
    public string Section { get; set; } = "hero";
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class BannerCreateUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaLink { get; set; } = string.Empty;
    public string Section { get; set; } = "hero";
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class DashboardStatsDto
{
    public decimal RevenueToday { get; set; }
    public decimal RevenueMonth { get; set; }
    public int OrdersToday { get; set; }
    public int OrdersMonth { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public int LowStockCount { get; set; }
    public List<SalesChartPointDto> SalesChart { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
}

public class SalesChartPointDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}

public class TopProductDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}

public class CustomerDto
{
    public string Id { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? PhoneNumber { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastOrderDate { get; set; }
}

public class OrderStatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}
