using System.ComponentModel.DataAnnotations;

namespace QCardPayment.dto;



public class LoginRequest
{
    
    [Required]
   [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}