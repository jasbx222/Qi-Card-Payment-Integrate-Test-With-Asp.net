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

    public Task SeedDemoProductsAsync() => Task.CompletedTask;
}
