using Microsoft.EntityFrameworkCore;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.DataBase;

namespace QCardPayment.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly DataContext _db;

    public OrderRepository(DataContext db)
    {
        _db = db;
    }

    public async Task<Orders> AddAsync(Orders order)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existingOrder = await _db.Orders.FindAsync(id);
        if (existingOrder is null)
            return false;

        _db.Orders.Remove(existingOrder);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Orders>> GetAllAsync()
    {
        return await _db.Orders
            .Include(o => o.Payments)
            .ToListAsync();
    }

    public async Task<Orders?> GetByIdAsync(int id)
    {
        return await _db.Orders
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Orders?> UpdateAsync(Orders order)
    {
        var existingOrder = await _db.Orders.FindAsync(order.Id);
        if (existingOrder is null)
            return null;

        existingOrder.UserId = order.UserId;
        existingOrder.TotalAmount = order.TotalAmount;
        existingOrder.Status = order.Status;

        await _db.SaveChangesAsync();
        return existingOrder;
    }
}
