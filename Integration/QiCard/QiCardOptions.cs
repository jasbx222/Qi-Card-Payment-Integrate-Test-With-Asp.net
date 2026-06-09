namespace QCardPayment.Integration.QiCard;

/// <summary>
/// إعدادات بوابة Qi Card - انسخ هذا الملف واملأ القيم في appsettings.json
/// </summary>
public class QiCardOptions
{
    public const string SectionName = "QiCard";

    /// <summary>رابط API الخاص بـ Qi (Sandbox أو Production)</summary>
    public string BaseUrl { get; set; } = "https://uat-sandbox-3ds-api.qi.iq/api/v1/";

    /// <summary>معرّف التيرمينال - يُعطى من شركة Qi</summary>
    public string TerminalId { get; set; } = string.Empty;

    /// <summary>اسم المستخدم لـ Basic Auth</summary>
    public string BasicAuthUser { get; set; } = string.Empty;

    /// <summary>كلمة المرور لـ Basic Auth</summary>
    public string BasicAuthPassword { get; set; } = string.Empty;

    /// <summary>العملة الافتراضية (IQD للدينار العراقي)</summary>
    public string Currency { get; set; } = "IQD";

    /// <summary>لغة صفحة الدفع</summary>
    public string Locale { get; set; } = "ar_IQ";

    /// <summary>رابط إعادة توجيه العميل بعد إتمام الدفع (FinishPaymentUrl)</summary>
    public string FinishPaymentUrl { get; set; } = string.Empty;

    /// <summary>رابط Webhook لاستقبال إشعار حالة الدفع (NotificationUrl)</summary>
    public string NotificationUrl { get; set; } = string.Empty;

    /// <summary>تفعيل وضع المحاكاة بدون استدعاء API حقيقي (للتطوير فقط)</summary>
    public bool UseMock { get; set; }
}
