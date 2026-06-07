using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using QCardPayment.dto;

namespace QCardPayment.Service;

public class QiCardService
{
    private readonly HttpClient _client;
    private readonly string _terminalId;
    private readonly bool _useMock;

    public QiCardService(IHttpClientFactory factory, IConfiguration configuration)
    {
        _client = factory.CreateClient("QiCard");
        _terminalId = configuration["QiCard:TerminalId"] ?? "111111";
        _useMock = bool.TryParse(configuration["QiCard:UseMock"], out var useMock) && useMock;

        var basicUser = configuration["QiCard:BasicAuthUser"];
        var basicPassword = configuration["QiCard:BasicAuthPassword"];
        if (!string.IsNullOrWhiteSpace(basicUser) && basicPassword is not null)
        {
            var credentials = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{basicUser}:{basicPassword}"));
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        }
    }

    public async Task<string> CreatePaymentAsync(CreatePaymentRequest request)
    {
        if (!_client.DefaultRequestHeaders.Contains("X-Terminal-Id"))
        {
            _client.DefaultRequestHeaders.Add("X-Terminal-Id", _terminalId);
        }

        var response = await _client.PostAsJsonAsync("payment", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}