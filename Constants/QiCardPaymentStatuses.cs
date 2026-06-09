namespace QCardPayment.Constants;

/// <summary>
/// حالات الدفع كما تُرجعها Qi Card API
/// </summary>
public static class QiCardPaymentStatuses
{
    public const string Created = "CREATED";
    public const string FormShowed = "FORM_SHOWED";
    public const string AuthenticationRequired = "AUTHENTICATION_REQUIRED";
    public const string AuthenticationFailed = "AUTHENTICATION_FAILED";
    public const string Processing = "PROCESSING";
    public const string Success = "SUCCESS";
    public const string Failed = "FAILED";
}
