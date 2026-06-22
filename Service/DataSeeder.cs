using Microsoft.AspNetCore.Identity;
using QCardPayment.Models;

namespace QCardPayment.Service;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();

        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));

        if (!await roleManager.RoleExistsAsync("Customer"))
            await roleManager.CreateAsync(new IdentityRole("Customer"));

        const string adminPhone = "07700000001";
        var admin = await userManager.FindByNameAsync("admin");
        if (admin is null)
        {
            admin = new AppUser
            {
                UserName = "admin",
                PhoneNumber = adminPhone,
                PhoneNumberConfirmed = true
            };
            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, "Admin");
        }
        else if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}
