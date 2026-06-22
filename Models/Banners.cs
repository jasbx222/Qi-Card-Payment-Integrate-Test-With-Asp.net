namespace QCardPayment.Models;

public class Banners
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaLink { get; set; } = string.Empty;
    public string Section { get; set; } = "hero";
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
