using QCardPayment.Models;

namespace QCardPayment.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Products>> GetAllActiveAsync();
    Task<IEnumerable<Products>> GetAllAsync(bool includeInactive = false);
    Task<IEnumerable<Products>> SearchAsync(string? query, int? categoryId, bool? featured, string? sort);
    Task<Products?> GetByIdAsync(int id);
    Task<Products?> GetBySlugAsync(string slug);
    Task<Products> AddAsync(Products product);
    Task<Products?> UpdateAsync(Products product);
    Task<bool> DeleteAsync(int id);
    Task SeedDemoProductsAsync();
}
