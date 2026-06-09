namespace QCardPayment.Integration.QiCard.Dtos;

/// <summary>
/// طلب إنشاء عملية دفع عند Qi Card (مطابق لـ CreatePaymentRequest في Postman)
/// </summary>
public class QiCardCreatePaymentRequest
{
    /// <summary>معرّف فريد يُنشأ من طرف التاجر - يجب ألا يتكرر لنفس التيرمينال</summary>
    public string RequestId { get; set; } = string.Empty;

    /// <summary>مبلغ الدفع شامل العمولات</summary>
    public decimal Amount { get; set; }

    /// <summary>رمز العملة (مثال: IQD)</summary>
    public string Currency { get; set; } = "IQD";

    /// <summary>لغة واجهة الدفع</summary>
    public string? Locale { get; set; }

    /// <summary>رابط إعادة توجيه العميل بعد الدفع</summary>
    public string FinishPaymentUrl { get; set; } = string.Empty;

    /// <summary>رابط Webhook لإشعار حالة الدفع</summary>
    public string NotificationUrl { get; set; } = string.Empty;

    /// <summary>بيانات العميل (اختياري)</summary>
    public QiCardCustomerInfo? CustomerInfo { get; set; }

    /// <summary>معلومات إضافية (مثال: orderId)</summary>
    public Dictionary<string, string>? AdditionalInfo { get; set; }
}

public class QiCardCustomerInfo
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}
