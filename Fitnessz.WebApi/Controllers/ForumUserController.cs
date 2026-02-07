using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Fitnessz.WebApi.Controllers;
[ApiController]
[Route("[controller]")]
public class ForumUserController : ControllerBase
{
    /*
    private readonly IForumUserRepository userRepo;
    private readonly RsaSecurityKey _signingKey;

    public ForumUserController(IForumUserRepository uRepo, RsaSecurityKey signingKey)
    {
        userRepo = uRepo;
        _signingKey = signingKey;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto dto)
    {
        User? userByName = await userRepo.GetUserByNameAsync(dto.UserName);
        User? userByEmail = await userRepo.GetUserByEmailAsync(dto.Email);
        if (userByName != null || userByEmail != null)
        {
            return BadRequest("Account with these credentials couldn't be created");
        }
        
        var user = new User();
        user.Email = dto.Email;
        user.UserName = dto.UserName;
        user.Role = "User";

        User? result = await userRepo.RegisterUserAsync(user, dto.Password);
        if (result == null)
        {
            return BadRequest("Couldn't complete registration");
        }

        return Ok("Registration success");

    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> LoginAsync([FromBody] LoginDto dto)
    {
        User? user = await userRepo.GetUserByNameAsync(dto.UserName);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid credentials");
        }

        var token = CreateToken(user, _signingKey);
        
        return Ok(new
        {
            Token = token
        });
    }

    public string CreateToken(User user, RsaSecurityKey privateKey)
    {
        List<Claim> claims = new List<Claim> 
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.Role) 
            
        };
        var creds = new SigningCredentials(privateKey, SecurityAlgorithms.RsaSha256);

        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), //Questionable token should ezpire sonner !
            SigningCredentials = creds,
            Issuer = "Fitnessz.WebApi",
            Audience = "Fitnessz.Clients"
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    //Dto for registering the user the Db contains PasswordHash not Password 
    public record RegisterDto(string UserName, string Email, string Password);
    //Dto for registering the user the Db contains PasswordHash not Password 
    public record LoginDto(string UserName, string Password);
    */
}