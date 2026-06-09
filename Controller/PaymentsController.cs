using Microsoft.AspNetCore.Mvc;
using QCardPayment.Models;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.dto;
using QCardPayment.Integration.QiCard;
using QCardPayment.Integration.QiCard.Dtos;
using QCardPayment.Service;
using Microsoft.AspNetCore.Authorization;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IQiCardService _qiCardService;

    public PaymentsController(
        IPaymentRepository paymentRepository,
        IOrderRepository orderRepository,
        IQiCardService qiCardService)
    {
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
        _qiCardService = qiCardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var payments = await _paymentRepository.GetAllAsync();
        return Ok(payments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var payment = await _paymentRepository.GetByIdAsync(id);
        if (payment is null)
            return NotFound();

        return Ok(payment);
    }

    [HttpGet("order/{orderId}")]
    public async Task<IActionResult> GetByOrderId(int orderId)
    {
        var payments = await _paymentRepository.GetByOrderIdAsync(orderId);
        return Ok(payments);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PaymentCreateDto request)
    {
        if (request is null)
            return BadRequest();

        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order is null)
            return BadRequest("Order not found.");

        var requestId = string.IsNullOrWhiteSpace(request.RequestId)
            ? Guid.NewGuid().ToString()
            : request.RequestId;

        var payment = new Payments
        {
            OrderId = request.OrderId,
            RequestId = requestId,
            PaymentId = request.PaymentId,
            Amount = request.Amount,
            Status = request.Status,
            FormUrl = request.FormUrl
        };

        var createdPayment = await _paymentRepository.AddAsync(payment);
        return CreatedAtAction(nameof(GetById), new { id = createdPayment.Id }, createdPayment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PaymentCreateDto request)
    {
        if (request is null)
            return BadRequest();

        var existingPayment = await _paymentRepository.GetByIdAsync(id);
        if (existingPayment is null)
            return NotFound();

        var requestId = string.IsNullOrWhiteSpace(request.RequestId)
            ? existingPayment.RequestId
            : request.RequestId;

        existingPayment.OrderId = request.OrderId;
        existingPayment.RequestId = requestId;
        existingPayment.PaymentId = request.PaymentId;
        existingPayment.Amount = request.Amount;
        existingPayment.Status = request.Status;
        existingPayment.FormUrl = request.FormUrl;

        var updatedPayment = await _paymentRepository.UpdateAsync(existingPayment);
        return Ok(updatedPayment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _paymentRepository.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// إنشاء دفع مباشر عند Qi Card (بدون طلب) - للاختبار فقط
    /// في الإنتاج استخدم POST /api/checkout
    /// </summary>
    [HttpPost("external")]
    public async Task<IActionResult> CreateExternal([FromBody] QiCardCreatePaymentRequest request, CancellationToken ct)
    {
        if (request is null)
            return BadRequest();

        var response = await _qiCardService.CreatePaymentAsync(request, ct);
        return Ok(response);
    }

    /// <summary>مزامنة حالة دفع محلي مع Qi Card</summary>
    [HttpPost("{id}/sync")]
    public async Task<IActionResult> SyncStatus(int id, [FromServices] IPaymentFlowService flowService, CancellationToken ct)
    {
        var payment = await flowService.SyncPaymentStatusAsync(id, ct);
        if (payment is null)
            return NotFound();

        return Ok(payment);
    }
}
