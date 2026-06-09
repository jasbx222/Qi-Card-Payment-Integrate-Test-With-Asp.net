using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.Integration.QiCard.Dtos;
using QCardPayment.Service;

namespace QCardPayment.Controller;

/// <summary>
/// استقبال إشعارات Webhook من Qi Card (NotificationUrl)
/// يجب أن يكون هذا الرابط متاحاً من الإنترنت (استخدم ngrok للتطوير المحلي)
/// </summary>
[ApiController]
[Route("api/qicard")]
public class QiCardWebhookController : ControllerBase
{
    private readonly IPaymentFlowService _paymentFlowService;
    private readonly ILogger<QiCardWebhookController> _logger;

    public QiCardWebhookController(
        IPaymentFlowService paymentFlowService,
        ILogger<QiCardWebhookController> logger)
    {
        _paymentFlowService = paymentFlowService;
        _logger = logger;
    }

    /// <summary>
    /// Qi Card ترسل POST هنا عند اكتمال الدفع (SUCCESS / FAILED / AUTHENTICATION_FAILED)
    /// يجب الرد بـ 200 OK وإلا ستعيد المحاولة
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook([FromBody] QiCardPaymentResponse notification, CancellationToken ct)
    {
        _logger.LogInformation(
            "استلام Webhook من Qi Card: PaymentId={PaymentId}, Status={Status}, RequestId={RequestId}",
            notification.PaymentId, notification.Status, notification.RequestId);

        await _paymentFlowService.HandleWebhookAsync(notification, ct);

        // Qi Card تتوقع 200 OK
        return Ok();
    }
}
