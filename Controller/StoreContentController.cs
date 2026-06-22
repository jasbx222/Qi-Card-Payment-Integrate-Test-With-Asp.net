using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.Repositories;

namespace QCardPayment.Controller;

[ApiController]
[Route("api")]
public class StoreContentController : ControllerBase
{
    private readonly BannerRepository _banners;
    private readonly CategoryRepository _categories;
    private readonly StoreSettingsRepository _settings;

    public StoreContentController(
        BannerRepository banners,
        CategoryRepository categories,
        StoreSettingsRepository settings)
    {
        _banners = banners;
        _categories = categories;
        _settings = settings;
    }

    [HttpGet("banners")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBanners([FromQuery] string? section)
        => Ok(await _banners.GetActiveAsync(section));

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories()
        => Ok(await _categories.GetAllAsync());

    [HttpGet("settings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSettings()
        => Ok(await _settings.GetAsync());
}
