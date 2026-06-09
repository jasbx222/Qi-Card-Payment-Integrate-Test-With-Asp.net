namespace QCardPayment.Constants;

/// <summary>
/// حالات الطلب في نظامنا (ليست حالات Qi Card)
/// </summary>
public static class OrderStatuses
{
    public const string Pending = "Pending";
    public const string AwaitingPayment = "AwaitingPayment";
    public const string Paid = "Paid";
    public const string Failed = "Failed";
    public const string Cancelled = "Cancelled";
}
