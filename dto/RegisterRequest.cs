using System.ComponentModel.DataAnnotations;

namespace QCardPayment.dto;



public class RegisterRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
   [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}