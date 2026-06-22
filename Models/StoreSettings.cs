namespace QCardPayment.Models;

public class StoreSettings
{
    public int Id { get; set; }
    public string StoreName { get; set; } = "أوربيتا ستور";
    public string Tagline { get; set; } = "رحلتك في مجرّة الكارتون";
    public string LogoUrl { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Facebook { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    public string TikTok { get; set; } = string.Empty;
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
}
