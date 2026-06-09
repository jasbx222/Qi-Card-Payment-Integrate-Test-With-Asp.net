using QCardPayment.Models;

namespace QCardPayment.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Products>> GetAllActiveAsync();
    Task<Products?> GetByIdAsync(int id);
    Task SeedDemoProductsAsync();
}
