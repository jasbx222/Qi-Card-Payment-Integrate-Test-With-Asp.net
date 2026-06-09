using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.Integration.QiCard;
using QCardPayment.Integration.QiCard.Dtos;
using QCardPayment.Service;

namespace QCardPayment.Controller;

/// <summary>
/// نقاط نهاية إدارية لـ Qi Card (استعلام، إلغاء، استرداد)
/// انسخ هذه الـ endpoints لأي نظام يحتاج إدارة مدفوعات
/// </summary>
[ApiController]
[Route("api/qicard")]
[Authorize]
public class QiCardAdminController : ControllerBase
{
    private readonly IQiCardService _qiCardService;
    private readonly IPaymentFlowService _paymentFlowService;

    public QiCardAdminController(IQiCardService qiCardService, IPaymentFlowService paymentFlowService)
    {
        _qiCardService = qiCardService;
        _paymentFlowService = paymentFlowService;
    }

    /// <summary>استعلام حالة دفع من Qi Card بالـ PaymentId</summary>
    [HttpGet("status/{paymentId}")]
    public async Task<IActionResult> GetStatus(string paymentId, CancellationToken ct)
    {
        var status = await _qiCardService.GetPaymentStatusAsync(paymentId, ct);
        return Ok(status);
    }

    /// <summary>استعلام حالة دفع بالـ RequestId</summary>
    [HttpGet("status/by-request/{requestId}")]
    public async Task<IActionResult> GetStatusByRequest(string requestId, CancellationToken ct)
    {
        var status = await _qiCardService.GetPaymentStatusByRequestIdAsync(requestId, ct);
        return Ok(status);
    }

    /// <summary>مزامنة حالة دفع محلي مع Qi Card</summary>
    [HttpPost("sync/{localPaymentId:int}")]
    public async Task<IActionResult> SyncLocalPayment(int localPaymentId, CancellationToken ct)
    {
        var payment = await _paymentFlowService.SyncPaymentStatusAsync(localPaymentId, ct);
        if (payment is null)
            return NotFound(new { message = "الدفع غير موجود." });

        return Ok(payment);
    }

    /// <summary>إلغاء عملية دفع</summary>
    [HttpPost("cancel/{paymentId}")]
    public async Task<IActionResult> Cancel(string paymentId, [FromBody] QiCardCancelPaymentRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
            request.RequestId = Guid.NewGuid().ToString();

        var result = await _qiCardService.CancelPaymentAsync(paymentId, request, ct);
        return Ok(result);
    }

    /// <summary>استرداد مبلغ (كامل أو جزئي)</summary>
    [HttpPost("refund/{paymentId}")]
    public async Task<IActionResult> Refund(string paymentId, [FromBody] QiCardRefundRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
            request.RequestId = Guid.NewGuid().ToString();

        var result = await _qiCardService.RefundPaymentAsync(paymentId, request, ct);
        return Ok(result);
    }
}
