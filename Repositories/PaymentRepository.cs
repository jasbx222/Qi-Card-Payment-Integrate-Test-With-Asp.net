using Microsoft.EntityFrameworkCore;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.DataBase;

namespace QCardPayment.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly DataContext _db;

    public PaymentRepository(DataContext db)
    {
        _db = db;
    }

    public async Task<Payments> AddAsync(Payments payment)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return payment;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existingPayment = await _db.Payments.FindAsync(id);
        if (existingPayment is null)
            return false;

        _db.Payments.Remove(existingPayment);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Payments>> GetAllAsync()
    {
        return await _db.Payments
            .Include(p => p.Order)
            .ToListAsync();
    }

    public async Task<Payments?> GetByIdAsync(int id)
    {
        return await _db.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Payments>> GetByOrderIdAsync(int orderId)
    {
        return await _db.Payments
            .Where(p => p.OrderId == orderId)
            .Include(p => p.Order)
            .ToListAsync();
    }

    public async Task<Payments?> UpdateAsync(Payments payment)
    {
        var existingPayment = await _db.Payments.FindAsync(payment.Id);
        if (existingPayment is null)
            return null;

        existingPayment.OrderId = payment.OrderId;
        existingPayment.RequestId = payment.RequestId;
        existingPayment.PaymentId = payment.PaymentId;
        existingPayment.Amount = payment.Amount;
        existingPayment.Status = payment.Status;
        existingPayment.FormUrl = payment.FormUrl;

        await _db.SaveChangesAsync();
        return existingPayment;
    }
}
