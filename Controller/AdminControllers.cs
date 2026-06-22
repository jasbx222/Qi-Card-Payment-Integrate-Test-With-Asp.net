using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QCardPayment.dto;
using QCardPayment.Models;
using QCardPayment.Repositories;
using QCardPayment.Repositories.Interfaces;

namespace QCardPayment.Controller;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderRepository _orders;

    public AdminOrdersController(IOrderRepository orders) => _orders = orders;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var items = await _orders.GetAllAsync();
        if (!string.IsNullOrWhiteSpace(status))
            items = items.Where(o => o.Status == status);
        return Ok(items.OrderByDescending(o => o.Id));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orders.GetByIdAsync(id);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatusUpdateDto dto)
    {
        var order = await _orders.GetByIdAsync(id);
        if (order is null) return NotFound();
        order.Status = dto.Status;
        var updated = await _orders.UpdateAsync(order);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _orders.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}

[ApiController]
[Route("api/admin/coupons")]
[Authorize(Roles = "Admin")]
public class AdminCouponsController : ControllerBase
{
    private readonly CouponRepository _coupons;

    public AdminCouponsController(CouponRepository coupons) => _coupons = coupons;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _coupons.GetAllAsync();
        return Ok(items.Select(Map));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CouponCreateUpdateDto dto)
    {
        var created = await _coupons.AddAsync(MapToEntity(dto, new Coupons()));
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CouponCreateUpdateDto dto)
    {
        var existing = await _coupons.GetByIdAsync(id);
        if (existing is null) return NotFound();
        var updated = await _coupons.UpdateAsync(MapToEntity(dto, existing));
        return Ok(Map(updated!));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _coupons.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private static CouponDto Map(Coupons c) => new()
    {
        Id = c.Id, Code = c.Code, DiscountType = c.DiscountType, Value = c.Value,
        MinOrderAmount = c.MinOrderAmount, MaxUses = c.MaxUses, UsedCount = c.UsedCount,
        ExpiresAt = c.ExpiresAt, IsActive = c.IsActive
    };

    private static Coupons MapToEntity(CouponCreateUpdateDto dto, Coupons c)
    {
        c.Code = dto.Code.ToUpperInvariant();
        c.DiscountType = dto.DiscountType;
        c.Value = dto.Value;
        c.MinOrderAmount = dto.MinOrderAmount;
        c.MaxUses = dto.MaxUses;
        c.ExpiresAt = dto.ExpiresAt;
        c.IsActive = dto.IsActive;
        return c;
    }
}

[ApiController]
[Route("api/admin/banners")]
[Authorize(Roles = "Admin")]
public class AdminBannersController : ControllerBase
{
    private readonly BannerRepository _banners;

    public AdminBannersController(BannerRepository banners) => _banners = banners;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _banners.GetAllAsync();
        return Ok(items.Select(Map));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BannerCreateUpdateDto dto)
    {
        var created = await _banners.AddAsync(MapToEntity(dto, new Banners()));
        return Ok(Map(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BannerCreateUpdateDto dto)
    {
        var existing = await _banners.GetByIdAsync(id);
        if (existing is null) return NotFound();
        var updated = await _banners.UpdateAsync(MapToEntity(dto, existing));
        return Ok(Map(updated!));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _banners.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private static BannerDto Map(Banners b) => new()
    {
        Id = b.Id, Title = b.Title, Subtitle = b.Subtitle, ImageUrl = b.ImageUrl,
        CtaText = b.CtaText, CtaLink = b.CtaLink, Section = b.Section,
        SortOrder = b.SortOrder, IsActive = b.IsActive
    };

    private static Banners MapToEntity(BannerCreateUpdateDto dto, Banners b)
    {
        b.Title = dto.Title; b.Subtitle = dto.Subtitle; b.ImageUrl = dto.ImageUrl;
        b.CtaText = dto.CtaText; b.CtaLink = dto.CtaLink; b.Section = dto.Section;
        b.SortOrder = dto.SortOrder; b.IsActive = dto.IsActive;
        return b;
    }
}

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController : ControllerBase
{
    private readonly StoreSettingsRepository _settings;

    public AdminSettingsController(StoreSettingsRepository settings) => _settings = settings;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _settings.GetAsync());

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] StoreSettings dto) =>
        Ok(await _settings.UpdateAsync(dto));
}

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly DashboardRepository _dashboard;

    public AdminDashboardController(DashboardRepository dashboard) => _dashboard = dashboard;

    [HttpGet]
    public async Task<IActionResult> GetStats() => Ok(await _dashboard.GetStatsAsync());
}

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin")]
public class AdminCustomersController : ControllerBase
{
    private readonly DataBase.DataContext _db;

    public AdminCustomersController(DataBase.DataContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = _db.Users.ToList();
        var orders = _db.Orders.ToList();
        var result = users.Select(u =>
        {
            var userOrders = orders.Where(o => o.UserId == u.Id).ToList();
            return new CustomerDto
            {
                Id = u.Id,
                UserName = u.UserName,
                PhoneNumber = u.PhoneNumber,
                OrderCount = userOrders.Count,
                TotalSpent = userOrders.Where(o => o.Status == Constants.OrderStatuses.Paid).Sum(o => o.TotalAmount),
                LastOrderDate = userOrders.Any() ? DateTime.UtcNow : null
            };
        }).OrderByDescending(c => c.OrderCount);
        return Ok(result);
    }
}
