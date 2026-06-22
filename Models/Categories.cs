namespace QCardPayment.Models;

public class Categories
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public Categories? Parent { get; set; }
    public ICollection<Categories> Children { get; set; } = new List<Categories>();
    public ICollection<Products> Products { get; set; } = new List<Products>();
}
