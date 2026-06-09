namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// جسم الطلب عند استخدام ApiKeyAuth (X-Signature)
/// </summary>
public class QiCardRequestIdBody
{
    public string RequestId { get; set; } = string.Empty;
}
