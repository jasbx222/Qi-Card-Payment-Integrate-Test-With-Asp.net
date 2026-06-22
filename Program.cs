using Microsoft.EntityFrameworkCore;
using Serilog;
using Microsoft.AspNetCore.Identity;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Microsoft.OpenApi.Models;
using Hangfire;
using QCardPayment.DataBase;
using QCardPayment.Service;
using QCardPayment.Repositories;
using QCardPayment.Repositories.Interfaces;
using QCardPayment.Models;
using QCardPayment.Integration.QiCard;

// using Delivery_Management_System.DataBase;


// -----------------------------------------------
// Main application startup and service registration.
// -----------------------------------------------
var builder = WebApplication.CreateBuilder(args);

// ================= Serilog Configuration =================
Log.Logger = new LoggerConfiguration()
    
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ================= Controllers =================
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        // هذا السطر يحول الـ Enums من أرقام إلى نصوص في الـ JSON
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();

// ================= Swagger (With JWT Bearer Config) =================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Qi Card Payment Integration API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {your_token}"
    });

    c.AddSecurityRequirement
    (new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// ================= DB Context =================
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
//==================scoped services =================
// builder.Services.AddScoped<ICustomer, CustomerRepository>();
//==================scoped services =================
// ── وحدة Qi Card القابلة لإعادة الاستخدام ──
builder.Services.AddQiCardPayment(builder.Configuration);

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IPaymentFlowService, PaymentFlowService>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<CouponRepository>();
builder.Services.AddScoped<BannerRepository>();
builder.Services.AddScoped<StoreSettingsRepository>();
builder.Services.AddScoped<DashboardRepository>();

builder.Services.AddScoped<TokenService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});
//====================Cashing //==============
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetSection("redis:Configuration").Value;
    options.InstanceName = builder.Configuration.GetSection("redis:InstanceName").Value;
});
// ================= Identity =================
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

// ================= JWT Authentication =================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing!"))
        ),
        RoleClaimType = System.Security.Claims.ClaimTypes.Role,
        ClockSkew = TimeSpan.Zero
    };
});
// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("DeleteMovie", policy =>
//     {
//         policy.RequireClaim("Permission", "DeleteMovie");
//     });
// });
// ================= Dependency Injection (DI) =================

// builder.Services.AddAutoMapper(
//     typeof(Program));
// ================= Hangfire =================
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddHangfireServer();

var app = builder.Build();

//hangfire dashboard
app.UseHangfireDashboard();
// ================= Middleware Pipeline =================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Qi Card Payment API v1");
            c.EnablePersistAuthorization();
    });
}

app.UseCors("Frontend");

app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ── تطبيق Migrations وتهيئة بيانات تجريبية عند التشغيل ──
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    await db.Database.MigrateAsync();

    await DataSeeder.SeedAsync(scope.ServiceProvider);

    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    await DemoDataSeeder.SeedAsync(db, userManager, config);
}

app.Run();