namespace Fitnessz.WebApi.DTOs;

public class TokenRequestDTO
{
    public required string UserName { get; set; }
    public required string RefreshToken { get; set; }
}