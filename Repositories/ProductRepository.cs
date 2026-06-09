using Microsoft.EntityFrameworkCore;
using QCardPayment.DataBase;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly DataContext _db;

    public ProductRepository(DataContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Products>> GetAllActiveAsync()
    {
        return await _db.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Products?> GetByIdAsync(int id)
    {
        return await _db.Products.FindAsync(id);
    }

    /// <summary>
    /// إضافة منتجات تجريبية عند أول تشغيل (للتجربة فقط)
    /// </summary>
    public async Task SeedDemoProductsAsync()
    {
        if (await _db.Products.AnyAsync())
            return;

        _db.Products.AddRange(
            new Products { Name = "هاتف ذكي", Description = "هاتف ذكي 128GB", Price = 350000, IsActive = true },
            new Products { Name = "سماعات لاسلكية", Description = "سماعات بلوتوث", Price = 45000, IsActive = true },
            new Products { Name = "شاحن سريع", Description = "شاحن 65 واط", Price = 25000, IsActive = true }
        );

        await _db.SaveChangesAsync();
    }
}
