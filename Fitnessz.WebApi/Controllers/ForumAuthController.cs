using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.DTOs;
using Microsoft.IdentityModel.Tokens;

namespace Fitnessz.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumAuthController : ControllerBase
{
    private readonly UserManager<User> _userManagerRepo;
    private readonly IConfiguration _configuration;
    private readonly RoleManager<IdentityRole<int>> _roleManager;

    public ForumAuthController(UserManager<User> userManagerRepo, IConfiguration configuration, RoleManager<IdentityRole<int>> roleManager)
    {
        _userManagerRepo = userManagerRepo;
        _configuration = configuration;
        _roleManager = roleManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO registerDto)
    {
        var existingUser = await _userManagerRepo.FindByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            return BadRequest("Registration failed");
        }

        User user = new User()
        {
            UserName = registerDto.UserName,
            Email = registerDto.Email,
            CreatedAt = DateTime.UtcNow
        };

        try 
        {
            var result = await _userManagerRepo.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest("Registration failed");
            }
            if (!await _roleManager.RoleExistsAsync("User")) 
            {
                await _roleManager.CreateAsync(new IdentityRole<int>("User"));
            }
            await _userManagerRepo.AddToRoleAsync(user, "User");
            var roles = new List<string> { "User" };
            var token = GenerateJwtToken(user, roles);

            return Ok(new {token = token, username = user.UserName });
        }
        catch (Exception ex)
        {
            
            return BadRequest("Registration failed" );
        }
        
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO loginDto)
    {
        var user = await _userManagerRepo.FindByEmailAsync(loginDto.Email);

        if (user == null) return Unauthorized("Invalid credentials");

        var result = await _userManagerRepo.CheckPasswordAsync(user, loginDto.Password);
        if (!result) return Unauthorized("Invalid credentials");

        var roles = await _userManagerRepo.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new { token = token, username = user.UserName });
    }

    private string GenerateJwtToken(User user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, user.UserName!)
        };
        foreach (string role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}