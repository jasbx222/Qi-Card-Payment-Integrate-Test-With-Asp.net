using QCardPayment.Models;

namespace QCardPayment.Repositories.Interfaces;

public interface IOrderRepository
{
    Task<IEnumerable<Orders>> GetAllAsync();
    Task<Orders?> GetByIdAsync(int id);
    Task<Orders> AddAsync(Orders order);
    Task<Orders?> UpdateAsync(Orders order);
    Task<bool> DeleteAsync(int id);
}
