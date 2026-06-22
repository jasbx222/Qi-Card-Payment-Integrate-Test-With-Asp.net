using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductsController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? q,
        [FromQuery] int? categoryId,
        [FromQuery] bool? featured,
        [FromQuery] string? sort)
    {
        if (q is not null || categoryId is not null || featured is not null || sort is not null)
        {
            var filtered = await _productRepository.SearchAsync(q, categoryId, featured, sort);
            return Ok(filtered);
        }

        var products = await _productRepository.GetAllActiveAsync();
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null || !product.IsActive)
            return NotFound(new { message = "المنتج غير موجود." });

        return Ok(product);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _productRepository.GetBySlugAsync(slug);
        if (product is null)
            return NotFound(new { message = "المنتج غير موجود." });

        return Ok(product);
    }
}
