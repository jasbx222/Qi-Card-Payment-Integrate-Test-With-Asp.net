using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.dto;
using QCardPayment.Models;
using QCardPayment.Repositories;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoriesController : ControllerBase
{
    private readonly CategoryRepository _categories;

    public AdminCategoriesController(CategoryRepository categories) => _categories = categories;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _categories.GetAllAsync(includeInactive: true);
        var result = new List<CategoryDto>();
        foreach (var c in items)
            result.Add(await MapAsync(c));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateUpdateDto dto)
    {
        var cat = MapToEntity(dto, new Categories());
        if (string.IsNullOrWhiteSpace(cat.Slug))
            cat.Slug = Slugify(cat.Name);
        var created = await _categories.AddAsync(cat);
        return Ok(await MapAsync(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateUpdateDto dto)
    {
        var existing = await _categories.GetByIdAsync(id);
        if (existing is null) return NotFound();
        var updated = await _categories.UpdateAsync(MapToEntity(dto, existing));
        return Ok(await MapAsync(updated!));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _categories.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<CategoryDto> MapAsync(Categories c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        Slug = c.Slug,
        ImageUrl = c.ImageUrl,
        ParentId = c.ParentId,
        SortOrder = c.SortOrder,
        IsActive = c.IsActive,
        ProductCount = await _categories.GetProductCountAsync(c.Id)
    };

    private static Categories MapToEntity(CategoryCreateUpdateDto dto, Categories c)
    {
        c.Name = dto.Name;
        c.Description = dto.Description;
        c.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? Slugify(dto.Name) : dto.Slug;
        c.ImageUrl = dto.ImageUrl;
        c.ParentId = dto.ParentId;
        c.SortOrder = dto.SortOrder;
        c.IsActive = dto.IsActive;
        return c;
    }

    private static string Slugify(string text) =>
        Regex.Replace(text.Trim().ToLowerInvariant(), @"\s+", "-");
}
