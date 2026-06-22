using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.dto;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;

    public OrdersController(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("my/{id}")]
    public async Task<IActionResult> GetMyOrder(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var order = await _orderRepository.GetByIdForUserAsync(id, userId);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderRepository.GetAllAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (User.IsInRole("Admin"))
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order is null ? NotFound() : Ok(order);
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userOrder = await _orderRepository.GetByIdForUserAsync(id, userId!);
        return userOrder is null ? NotFound() : Ok(userOrder);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _orderRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
