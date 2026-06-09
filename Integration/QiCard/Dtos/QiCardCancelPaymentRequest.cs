namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// طلب إلغاء عملية دفع
/// </summary>
public class QiCardCancelPaymentRequest
{
    public string RequestId { get; set; } = string.Empty;

    /// <summary>مبلغ الإلغاء - إن تُرك فارغاً يُلغى المبلغ كاملاً</summary>
    public decimal? Amount { get; set; }
}
