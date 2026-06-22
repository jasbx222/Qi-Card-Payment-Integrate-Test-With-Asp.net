using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.dto;
using QCardPayment.Models;
using QCardPayment.Repositories;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public class AdminProductsController : ControllerBase
{
    private readonly IProductRepository _products;

    public AdminProductsController(IProductRepository products) => _products = products;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = true)
    {
        var items = await _products.GetAllAsync(includeInactive);
        return Ok(items.Select(MapProduct));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _products.GetByIdAsync(id);
        return p is null ? NotFound() : Ok(MapProduct(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateUpdateDto dto)
    {
        var product = MapToEntity(dto, new Products());
        if (string.IsNullOrWhiteSpace(product.Slug))
            product.Slug = Slugify(product.Name);
        var created = await _products.AddAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapProduct(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductCreateUpdateDto dto)
    {
        var existing = await _products.GetByIdAsync(id);
        if (existing is null) return NotFound();
        var updated = await _products.UpdateAsync(MapToEntity(dto, existing));
        return Ok(MapProduct(updated!));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _products.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    internal static ProductDto MapProduct(Products p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Slug = p.Slug,
        Sku = p.Sku,
        ImageUrl = p.ImageUrl,
        Price = p.Price,
        CompareAtPrice = p.CompareAtPrice,
        StockQuantity = p.StockQuantity,
        IsActive = p.IsActive,
        IsFeatured = p.IsFeatured,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name
    };

    private static Products MapToEntity(ProductCreateUpdateDto dto, Products p)
    {
        p.Name = dto.Name;
        p.Description = dto.Description;
        p.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? Slugify(dto.Name) : dto.Slug;
        p.Sku = dto.Sku;
        p.ImageUrl = dto.ImageUrl;
        p.Price = dto.Price;
        p.CompareAtPrice = dto.CompareAtPrice;
        p.StockQuantity = dto.StockQuantity;
        p.IsActive = dto.IsActive;
        p.IsFeatured = dto.IsFeatured;
        p.CategoryId = dto.CategoryId;
        return p;
    }

    private static string Slugify(string text) =>
        Regex.Replace(text.Trim().ToLowerInvariant(), @"\s+", "-");
}
