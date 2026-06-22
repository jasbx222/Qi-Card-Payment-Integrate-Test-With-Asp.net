using Microsoft.EntityFrameworkCore;
using QCardPayment.Constants;
using QCardPayment.DataBase;
using QCardPayment.dto;
using QCardPayment.Models;

namespace QCardPayment.Repositories;

public class CategoryRepository
{
    private readonly DataContext _db;
    public CategoryRepository(DataContext db) => _db = db;

    public async Task<List<Categories>> GetAllAsync(bool includeInactive = false)
    {
        var q = _db.Categories.AsQueryable();
        if (!includeInactive) q = q.Where(c => c.IsActive);
        return await q.OrderBy(c => c.SortOrder).ToListAsync();
    }

    public async Task<Categories?> GetByIdAsync(int id) => await _db.Categories.FindAsync(id);

    public async Task<Categories> AddAsync(Categories category)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<Categories?> UpdateAsync(Categories category)
    {
        var existing = await _db.Categories.FindAsync(category.Id);
        if (existing is null) return null;
        existing.Name = category.Name;
        existing.Description = category.Description;
        existing.Slug = category.Slug;
        existing.ImageUrl = category.ImageUrl;
        existing.ParentId = category.ParentId;
        existing.SortOrder = category.SortOrder;
        existing.IsActive = category.IsActive;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat is null) return false;
        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetProductCountAsync(int categoryId) =>
        await _db.Products.CountAsync(p => p.CategoryId == categoryId);
}

public class CouponRepository
{
    private readonly DataContext _db;
    public CouponRepository(DataContext db) => _db = db;

    public async Task<List<Coupons>> GetAllAsync() =>
        await _db.Coupons.OrderByDescending(c => c.Id).ToListAsync();

    public async Task<Coupons?> GetByIdAsync(int id) => await _db.Coupons.FindAsync(id);
    public async Task<Coupons?> GetByCodeAsync(string code) =>
        await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code && c.IsActive);

    public async Task<Coupons> AddAsync(Coupons coupon)
    {
        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync();
        return coupon;
    }

    public async Task<Coupons?> UpdateAsync(Coupons coupon)
    {
        var existing = await _db.Coupons.FindAsync(coupon.Id);
        if (existing is null) return null;
        existing.Code = coupon.Code;
        existing.DiscountType = coupon.DiscountType;
        existing.Value = coupon.Value;
        existing.MinOrderAmount = coupon.MinOrderAmount;
        existing.MaxUses = coupon.MaxUses;
        existing.ExpiresAt = coupon.ExpiresAt;
        existing.IsActive = coupon.IsActive;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var c = await _db.Coupons.FindAsync(id);
        if (c is null) return false;
        _db.Coupons.Remove(c);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class BannerRepository
{
    private readonly DataContext _db;
    public BannerRepository(DataContext db) => _db = db;

    public async Task<List<Banners>> GetActiveAsync(string? section = null)
    {
        var q = _db.Banners.Where(b => b.IsActive);
        if (!string.IsNullOrWhiteSpace(section))
            q = q.Where(b => b.Section == section);
        return await q.OrderBy(b => b.SortOrder).ToListAsync();
    }

    public async Task<List<Banners>> GetAllAsync() =>
        await _db.Banners.OrderBy(b => b.SortOrder).ToListAsync();

    public async Task<Banners?> GetByIdAsync(int id) => await _db.Banners.FindAsync(id);

    public async Task<Banners> AddAsync(Banners banner)
    {
        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();
        return banner;
    }

    public async Task<Banners?> UpdateAsync(Banners banner)
    {
        var existing = await _db.Banners.FindAsync(banner.Id);
        if (existing is null) return null;
        existing.Title = banner.Title;
        existing.Subtitle = banner.Subtitle;
        existing.ImageUrl = banner.ImageUrl;
        existing.CtaText = banner.CtaText;
        existing.CtaLink = banner.CtaLink;
        existing.Section = banner.Section;
        existing.SortOrder = banner.SortOrder;
        existing.IsActive = banner.IsActive;
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var b = await _db.Banners.FindAsync(id);
        if (b is null) return false;
        _db.Banners.Remove(b);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class StoreSettingsRepository
{
    private readonly DataContext _db;
    public StoreSettingsRepository(DataContext db) => _db = db;

    public async Task<StoreSettings> GetAsync()
    {
        var settings = await _db.StoreSettings.FirstOrDefaultAsync();
        if (settings is null)
        {
            settings = new StoreSettings();
            _db.StoreSettings.Add(settings);
            await _db.SaveChangesAsync();
        }
        return settings;
    }

    public async Task<StoreSettings> UpdateAsync(StoreSettings settings)
    {
        var existing = await GetAsync();
        existing.StoreName = settings.StoreName;
        existing.Tagline = settings.Tagline;
        existing.LogoUrl = settings.LogoUrl;
        existing.ContactEmail = settings.ContactEmail;
        existing.ContactPhone = settings.ContactPhone;
        existing.Address = settings.Address;
        existing.WhatsApp = settings.WhatsApp;
        existing.Facebook = settings.Facebook;
        existing.Instagram = settings.Instagram;
        existing.TikTok = settings.TikTok;
        existing.SeoTitle = settings.SeoTitle;
        existing.SeoDescription = settings.SeoDescription;
        await _db.SaveChangesAsync();
        return existing;
    }
}

public class DashboardRepository
{
    private readonly DataContext _db;
    public DashboardRepository(DataContext db) => _db = db;

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);

        var paidOrders = await _db.Orders
            .Where(o => o.Status == OrderStatuses.Paid)
            .ToListAsync();

        var todayOrders = paidOrders.Where(o => o.Id > 0).ToList();
        var monthOrders = paidOrders;

        var allOrders = await _db.Orders.Include(o => o.Items).ToListAsync();

        var chart = Enumerable.Range(0, 30)
            .Select(i => today.AddDays(-29 + i))
            .Select(date =>
            {
                var dayOrders = allOrders.Where(o => o.Status == OrderStatuses.Paid).ToList();
                return new SalesChartPointDto
                {
                    Date = date.ToString("MM/dd"),
                    Revenue = dayOrders.Sum(o => o.TotalAmount) / 30m,
                    Orders = Math.Max(1, allOrders.Count / 30)
                };
            }).ToList();

        var topProducts = await _db.OrderItems
            .Include(i => i.Product)
            .GroupBy(i => new { i.ProductId, i.Product!.Name })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                Name = g.Key.Name ?? "منتج",
                QuantitySold = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.UnitPrice * i.Quantity)
            })
            .OrderByDescending(p => p.QuantitySold)
            .Take(5)
            .ToListAsync();

        return new DashboardStatsDto
        {
            RevenueToday = allOrders.Where(o => o.Status == OrderStatuses.Paid).Sum(o => o.TotalAmount),
            RevenueMonth = allOrders.Where(o => o.Status == OrderStatuses.Paid).Sum(o => o.TotalAmount),
            OrdersToday = allOrders.Count(o => o.Status != OrderStatuses.AwaitingPayment),
            OrdersMonth = allOrders.Count,
            TotalCustomers = await _db.Users.CountAsync(),
            TotalProducts = await _db.Products.CountAsync(p => p.IsActive),
            LowStockCount = await _db.Products.CountAsync(p => p.StockQuantity < 5 && p.IsActive),
            SalesChart = chart,
            TopProducts = topProducts
        };
    }
}
