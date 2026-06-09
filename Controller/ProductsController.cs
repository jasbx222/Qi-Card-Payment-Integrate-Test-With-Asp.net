using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Controller;

/// <summary>
/// عرض المنتجات المتاحة للشراء
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductsController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    /// <summary>
    /// جلب قائمة المنتجات النشطة (لا يحتاج تسجيل دخول)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productRepository.GetAllActiveAsync();
        return Ok(products);
    }

    /// <summary>
    /// جلب تفاصيل منتج واحد
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null)
            return NotFound(new { message = "المنتج غير موجود." });

        return Ok(product);
    }
}
