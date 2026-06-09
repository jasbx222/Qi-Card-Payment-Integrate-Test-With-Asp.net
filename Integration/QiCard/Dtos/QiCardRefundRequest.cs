namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// طلب استرداد مبلغ (كامل أو جزئي)
/// </summary>
public class QiCardRefundRequest
{
    public string RequestId { get; set; } = string.Empty;

    /// <summary>مبلغ الاسترداد - إن تُرك فارغاً يُسترد المبلغ كاملاً</summary>
    public decimal? Amount { get; set; }

    /// <summary>سبب الاسترداد</summary>
    public string? Message { get; set; }
}
