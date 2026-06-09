using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using QCardPayment.Integration.QiCard.Dtos;

namespace QCardPayment.Integration.QiCard;

/// <summary>
/// تنفيذ كامل لـ Qi Card Payment Gateway API
/// مطابق لـ Postman Collection - قابل للنسخ لأي مشروع ASP.NET Core
/// </summary>
public class QiCardService : IQiCardService
{
    private readonly HttpClient _client;
    private readonly QiCardOptions _options;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public QiCardService(IHttpClientFactory factory, IOptions<QiCardOptions> options)
    {
        _options = options.Value;
        _client = factory.CreateClient("QiCard");

        // إعداد Basic Auth كما في Postman Collection
        if (!string.IsNullOrWhiteSpace(_options.BasicAuthUser))
        {
            var credentials = Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes($"{_options.BasicAuthUser}:{_options.BasicAuthPassword}"));
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        }
    }

    /// <inheritdoc />
    public async Task<QiCardPaymentResponse> CreatePaymentAsync(
        QiCardCreatePaymentRequest request,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockPayment(request);

        using var httpRequest = CreateRequest(HttpMethod.Post, "payment");
        httpRequest.Content = JsonContent.Create(request);

        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardPaymentResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند إنشاء الدفع.");
    }

    /// <inheritdoc />
    public async Task<string> GetPaymentFormAsync(string paymentId, CancellationToken ct = default)
    {
        if (_options.UseMock)
            return $"<html><body>نموذج دفع تجريبي - PaymentId: {paymentId}</body></html>";

        using var httpRequest = CreateRequest(HttpMethod.Get, $"payment/{paymentId}");
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await response.Content.ReadAsStringAsync(ct);
    }

    /// <inheritdoc />
    public async Task<QiCardPaymentStatusResponse> GetPaymentStatusAsync(
        string paymentId,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockStatus(paymentId);

        using var httpRequest = CreateRequest(HttpMethod.Get, $"payment/{paymentId}/status");
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardPaymentStatusResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند استعلام الحالة.");
    }

    /// <inheritdoc />
    public async Task<QiCardPaymentStatusResponse> GetPaymentStatusByRequestIdAsync(
        string requestId,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockStatus(requestId, isRequestId: true);

        using var httpRequest = CreateRequest(HttpMethod.Get, $"payment/status/by/request/{requestId}");
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardPaymentStatusResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند استعلام الحالة.");
    }

    /// <inheritdoc />
    public async Task<QiCardPaymentResponse> CancelPaymentAsync(
        string paymentId,
        QiCardCancelPaymentRequest request,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockPayment(new QiCardCreatePaymentRequest { RequestId = request.RequestId, Amount = request.Amount ?? 0 });

        using var httpRequest = CreateRequest(HttpMethod.Post, $"payment/{paymentId}/cancel");
        httpRequest.Content = JsonContent.Create(request);
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardPaymentResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند الإلغاء.");
    }

    /// <inheritdoc />
    public async Task<QiCardPaymentResponse> CancelPaymentByRequestIdAsync(
        string requestId,
        QiCardCancelPaymentRequest request,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockPayment(new QiCardCreatePaymentRequest { RequestId = requestId, Amount = request.Amount ?? 0 });

        using var httpRequest = CreateRequest(HttpMethod.Post, $"payment/cancel/by/request/{requestId}");
        httpRequest.Content = JsonContent.Create(request);
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardPaymentResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند الإلغاء.");
    }

    /// <inheritdoc />
    public async Task<QiCardRefundResponse> RefundPaymentAsync(
        string paymentId,
        QiCardRefundRequest request,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockRefund(paymentId, request);

        using var httpRequest = CreateRequest(HttpMethod.Post, $"payment/{paymentId}/refund");
        httpRequest.Content = JsonContent.Create(request);
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardRefundResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند الاسترداد.");
    }

    /// <inheritdoc />
    public async Task<QiCardRefundResponse> RefundPaymentByRequestIdAsync(
        string requestId,
        QiCardRefundRequest request,
        CancellationToken ct = default)
    {
        if (_options.UseMock)
            return CreateMockRefund(requestId, request, isRequestId: true);

        using var httpRequest = CreateRequest(HttpMethod.Post, $"payment/refund/by/request/{requestId}");
        httpRequest.Content = JsonContent.Create(request);
        var response = await _client.SendAsync(httpRequest, ct);
        await EnsureSuccessOrThrowAsync(response, ct);
        return await ReadJsonAsync<QiCardRefundResponse>(response, ct)
               ?? throw new InvalidOperationException("استجابة Qi Card فارغة عند الاسترداد.");
    }

    // ─── دوال مساعدة داخلية ───────────────────────────────────────────

    private HttpRequestMessage CreateRequest(HttpMethod method, string relativeUrl)
    {
        var request = new HttpRequestMessage(method, relativeUrl);
        request.Headers.TryAddWithoutValidation("X-Terminal-Id", _options.TerminalId);
        return request;
    }

    private static async Task<T?> ReadJsonAsync<T>(HttpResponseMessage response, CancellationToken ct)
    {
        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, ct);
    }

    private static async Task EnsureSuccessOrThrowAsync(HttpResponseMessage response, CancellationToken ct)
    {
        if (response.IsSuccessStatusCode)
            return;

        var body = await response.Content.ReadAsStringAsync(ct);
        throw new HttpRequestException(
            $"فشل طلب Qi Card: {(int)response.StatusCode} {response.ReasonPhrase}. التفاصيل: {body}");
    }

    // ─── بيانات تجريبية للتطوير بدون اتصال حقيقي ─────────────────────

    private QiCardPaymentResponse CreateMockPayment(QiCardCreatePaymentRequest request)
    {
        var paymentId = Guid.NewGuid().ToString();
        return new QiCardPaymentResponse
        {
            RequestId = request.RequestId,
            PaymentId = paymentId,
            Status = "CREATED",
            Amount = request.Amount,
            Currency = request.Currency,
            CreationDate = DateTime.UtcNow,
            FormUrl = $"https://mock.qi.iq/payment/{paymentId}"
        };
    }

    private QiCardPaymentStatusResponse CreateMockStatus(string id, bool isRequestId = false)
    {
        return new QiCardPaymentStatusResponse
        {
            RequestId = isRequestId ? id : Guid.NewGuid().ToString(),
            PaymentId = isRequestId ? Guid.NewGuid().ToString() : id,
            Status = "SUCCESS",
            Amount = 100,
            Currency = "IQD",
            CreationDate = DateTime.UtcNow
        };
    }

    private static QiCardRefundResponse CreateMockRefund(
        string id,
        QiCardRefundRequest request,
        bool isRequestId = false)
    {
        return new QiCardRefundResponse
        {
            RefundId = Guid.NewGuid().ToString(),
            RequestId = request.RequestId,
            PaymentId = isRequestId ? Guid.NewGuid().ToString() : id,
            Amount = request.Amount ?? 100,
            Currency = "IQD",
            Status = "SUCCESS",
            CreationDate = DateTime.UtcNow,
            Message = request.Message
        };
    }
}
