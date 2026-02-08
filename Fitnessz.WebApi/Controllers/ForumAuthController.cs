using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.DTOs;
namespace Fitnessz.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumAuthController : ControllerBase
{
    private readonly UserManager<User> _userManagerRepo;

    public ForumAuthController(UserManager<User> userManagerRepo)
    {
        _userManagerRepo = userManagerRepo;
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

            return Ok("Registration successful");
        }
        catch (Exception ex)
        {
            
            return BadRequest("Registration failed" );
        }

    }
}