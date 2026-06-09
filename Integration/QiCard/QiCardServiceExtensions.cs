namespace QCardPayment.Integration.QiCard;

/// <summary>
/// تسجيل خدمة Qi Card في DI - انسخ هذا الملف واستدعِ AddQiCardPayment في Program.cs
/// </summary>
public static class QiCardServiceExtensions
{
    public static IServiceCollection AddQiCardPayment(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<QiCardOptions>(configuration.GetSection(QiCardOptions.SectionName));

        services.AddHttpClient("QiCard", (sp, client) =>
        {
            var options = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<QiCardOptions>>().Value;
            if (!string.IsNullOrWhiteSpace(options.BaseUrl))
                client.BaseAddress = new Uri(options.BaseUrl);
        });

        services.AddScoped<IQiCardService, QiCardService>();
        return services;
    }
}
