using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QCardPayment.dto;
using QCardPayment.Models;
using QCardPayment.Service;

namespace QCardPayment.Controller;


/// <summary>
/// المصادقة: تسجيل حساب جديد وتسجيل الدخول
/// الخطوة الأولى في سيناريو الشراء - يُرجع JWT للاستخدام في باقي الطلبات
/// </summary>
[ApiController]
[Route("/auth")]
public class AuthController : ControllerBase
{
    
    private readonly TokenService _tokenService;

    private readonly UserManager<AppUser> _userManager;

    public AuthController(TokenService tokenService , UserManager<AppUser> userManager)
    {
        _tokenService= tokenService;
_userManager = userManager;
    }


    /// <summary>تسجيل عميل جديد</summary>
    [HttpPost("/register")]
    public async Task<IActionResult> Register(RegisterRequest registerRequest)
    {
       var user = await _userManager.Users.FirstOrDefaultAsync(x=>x.PhoneNumber == registerRequest.PhoneNumber);
        if (user!=null)
            return BadRequest(new { message = "المستخدم موجود مسبقاً" });

        var newUser = new AppUser
        {
            PhoneNumber = registerRequest.PhoneNumber,
            PhoneNumberConfirmed = true,
             UserName =  registerRequest.Username
        };

         var result = await _userManager.CreateAsync(newUser, registerRequest.Password);
         if (!result.Succeeded)
             return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

         await _userManager.AddToRoleAsync(newUser, "Customer");

        return Ok(new { message = "تم إنشاء الحساب بنجاح" });
    }


    /// <summary>تسجيل الدخول - يُرجع Token للتفويض في Header: Bearer {token}</summary>
    [HttpPost("/Login")]
    public async Task<LoginResponse> LoginAsync(LoginRequest loginRequest)
{
    var user = await _userManager.Users
        .FirstOrDefaultAsync(x => x.PhoneNumber == loginRequest.PhoneNumber);
      
    if (user == null)
    {
        return new LoginResponse
        {
            IsSuccess = false,
            Message = "Invalid phone number or password"
        };
    }

     user.PhoneNumberConfirmed =true;
    
    if (await _userManager.IsLockedOutAsync(user))
    {
        return new LoginResponse
        {
            IsSuccess = false,
            Message = "Account is locked"
        };
    }

    if (!user.PhoneNumberConfirmed)
    {
        return new LoginResponse
        {
            IsSuccess = false,
            Message = "Phone number is not confirmed"
        };


    }

    var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginRequest.Password);

    if (!isPasswordValid)
    {
        await _userManager.AccessFailedAsync(user);

        return new LoginResponse
        {
            IsSuccess = false,
            Message = "Invalid phone number or password"
        };
    }

    await _userManager.ResetAccessFailedCountAsync(user);

    var token = _tokenService.GenerateToken(user);
    var roles = await _userManager.GetRolesAsync(user);
    
    return new LoginResponse
    {
        IsSuccess = true,
        Token = token,
        PhoneNumber = user.PhoneNumber,
        UserName = user.UserName,
        Roles = roles.ToList()
    };
}
  

}