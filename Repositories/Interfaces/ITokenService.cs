using QCardPayment.Models;

namespace QCardPayment.Repositories.Interfaces;

public interface ITokenService
{
    public string GenerateToken(AppUser user);
}