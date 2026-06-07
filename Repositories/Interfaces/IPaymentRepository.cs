using QCardPayment.Models;

namespace QCardPayment.Repositories.Interfaces;

public interface IPaymentRepository
{
    Task<IEnumerable<Payments>> GetAllAsync();
    Task<Payments?> GetByIdAsync(int id);
    Task<Payments> AddAsync(Payments payment);
    Task<Payments?> UpdateAsync(Payments payment);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Payments>> GetByOrderIdAsync(int orderId);
}
