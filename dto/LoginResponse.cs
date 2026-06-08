using System.ComponentModel.DataAnnotations;

namespace QCardPayment.dto;



public class LoginResponse
{
    

    public string PhoneNumber { get; set; } = string.Empty;

    public string UserName { get; set; }
public bool IsSuccess { get; set; }

public string Message { get; set; }
    public string Token { get; set; } = string.Empty;
}