using Microsoft.AspNetCore.Mvc;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.dto;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;

    public OrdersController(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderRepository.GetAllAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order is null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        if (request is null)
            return BadRequest();

        var order = new Orders
        {
            UserId = request.UserId,
            TotalAmount = request.TotalAmount,
            Status = request.Status
        };

        var createdOrder = await _orderRepository.AddAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateOrderRequest request)
    {
        if (request is null)
            return BadRequest();

        var existingOrder = await _orderRepository.GetByIdAsync(id);
        if (existingOrder is null)
            return NotFound();

        existingOrder.UserId = request.UserId;
        existingOrder.TotalAmount = request.TotalAmount;
        existingOrder.Status = request.Status;

        var updatedOrder = await _orderRepository.UpdateAsync(existingOrder);
        return Ok(updatedOrder);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _orderRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
