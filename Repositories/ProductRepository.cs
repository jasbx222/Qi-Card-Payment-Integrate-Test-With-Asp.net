using Microsoft.EntityFrameworkCore;
using QCardPayment.DataBase;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly DataContext _db;

    public ProductRepository(DataContext db) => _db = db;

    public async Task<IEnumerable<Products>> GetAllActiveAsync()
    {
        return await _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Products>> GetAllAsync(bool includeInactive = false)
    {
        var query = _db.Products.Include(p => p.Category).AsQueryable();
        if (!includeInactive)
            query = query.Where(p => p.IsActive);
        return await query.OrderByDescending(p => p.Id).ToListAsync();
    }

    public async Task<IEnumerable<Products>> SearchAsync(string? query, int? categoryId, bool? featured, string? sort)
    {
        var q = _db.Products.Include(p => p.Category).Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(query))
            q = q.Where(p => p.Name.Contains(query) || p.Description.Contains(query) || p.Sku.Contains(query));

        if (categoryId.HasValue)
            q = q.Where(p => p.CategoryId == categoryId);

        if (featured == true)
            q = q.Where(p => p.IsFeatured);

        q = sort switch
        {
            "price_asc" => q.OrderBy(p => p.Price),
            "price_desc" => q.OrderByDescending(p => p.Price),
            "newest" => q.OrderByDescending(p => p.Id),
            _ => q.OrderBy(p => p.Name)
        };

        return await q.ToListAsync();
    }

    public async Task<Products?> GetByIdAsync(int id) =>
        await _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Products?> GetBySlugAsync(string slug) =>
        await _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

    public async Task<Products> AddAsync(Products product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return product;
    }

    public async Task<Products?> UpdateAsync(Products product)
    {
        var existing = await _db.Products.FindAsync(product.Id);
        if (existing is null) return null;

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Slug = product.Slug;
        existing.Sku = product.Sku;
        existing.ImageUrl = product.ImageUrl;
        existing.Price = product.Price;
        existing.CompareAtPrice = product.CompareAtPrice;
        existing.StockQuantity = product.StockQuantity;
        existing.IsActive = product.IsActive;
        existing.IsFeatured = product.IsFeatured;
        existing.CategoryId = product.CategoryId;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return false;
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task SeedDemoProductsAsync()
    {
        if (await _db.Products.AnyAsync()) return;

        if (!await _db.Categories.AnyAsync())
        {
            _db.Categories.AddRange(
                new Categories { Name = "شخصيات", Slug = "characters", ImageUrl = "https://images.unsplash.com/photo-1614732414443-5913d070cacc?w=400", SortOrder = 1 },
                new Categories { Name = "ألعاب", Slug = "toys", ImageUrl = "https://images.unsplash.com/photo-1558060379-5a71d00293ff?w=400", SortOrder = 2 },
                new Categories { Name = "إكسسوارات", Slug = "accessories", ImageUrl = "https://images.unsplash.com/photo-1610641787871-282d67e0d1c5?w=400", SortOrder = 3 }
            );
            await _db.SaveChangesAsync();
        }

        var cat1 = await _db.Categories.FirstAsync(c => c.Slug == "characters");
        var cat2 = await _db.Categories.FirstAsync(c => c.Slug == "toys");

        _db.Products.AddRange(
            new Products { Name = "أسترو بير الفضائي", Description = "شخصية كارتونية محبوبة من مجرّة أوربيتا", Slug = "astro-bear", Sku = "ORB-001", Price = 350000, CompareAtPrice = 400000, StockQuantity = 50, IsActive = true, IsFeatured = true, CategoryId = cat1.Id, ImageUrl = "https://images.unsplash.com/photo-1614732414443-5913d070cacc?w=600" },
            new Products { Name = "روبوت نجمة", Description = "روبوت كارتوني بإضاءة LED", Slug = "star-robot", Sku = "ORB-002", Price = 280000, StockQuantity = 30, IsActive = true, IsFeatured = true, CategoryId = cat2.Id, ImageUrl = "https://images.unsplash.com/photo-1535378439737-cccffee8cd2c?w=600" },
            new Products { Name = "سماعات المدار", Description = "سماعات لاسلكية بتصميم فضائي", Slug = "orbit-headphones", Sku = "ORB-003", Price = 45000, StockQuantity = 100, IsActive = true, CategoryId = cat1.Id, ImageUrl = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600" },
            new Products { Name = "شاحن النجوم", Description = "شاحن سريع 65 واط", Slug = "star-charger", Sku = "ORB-004", Price = 25000, StockQuantity = 200, IsActive = true, IsFeatured = true, CategoryId = cat2.Id, ImageUrl = "https://images.unsplash.com/photo-1591290619762-d2fefd173782?w=600" },
            new Products { Name = "حقيبة الكوكب", Description = "حقيبة ظهر كارتونية للأطفال", Slug = "planet-bag", Sku = "ORB-005", Price = 55000, StockQuantity = 40, IsActive = true, CategoryId = cat1.Id, ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600" },
            new Products { Name = "مجموعة المجرة", Description = "طقم ألعاب فضائية كامل", Slug = "galaxy-set", Sku = "ORB-006", Price = 120000, CompareAtPrice = 150000, StockQuantity = 25, IsActive = true, IsFeatured = true, CategoryId = cat2.Id, ImageUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f83?w=600" }
        );

        if (!await _db.Banners.AnyAsync())
        {
            _db.Banners.Add(new Banners
            {
                Title = "ابدأ رحلتك في مجرّة الكارتون",
                Subtitle = "اكتشف كنوزاً فضائية من شخصيات وألعاب حصرية",
                CtaText = "تسوّق الآن",
                CtaLink = "/products",
                Section = "hero",
                SortOrder = 1,
                IsActive = true,
                ImageUrl = "https://images.unsplash.com/photo-1614732414443-5913d070cacc?w=1200"
            });
        }

        if (!await _db.StoreSettings.AnyAsync())
        {
            _db.StoreSettings.Add(new StoreSettings
            {
                StoreName = "أوربيتا ستور",
                Tagline = "رحلتك في مجرّة الكارتون",
                ContactPhone = "07700000000",
                ContactEmail = "info@orbita.iq",
                Address = "بغداد، العراق"
            });
        }

        await _db.SaveChangesAsync();
    }
}
