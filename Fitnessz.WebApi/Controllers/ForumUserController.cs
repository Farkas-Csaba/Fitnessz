using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Fitnessz.WebApi.Controllers;
[ApiController]
[Route("[controller]")]
public class ForumUserController : ControllerBase
{
    private readonly IForumUserRepository userRepo;

    public ForumUserController(IForumUserRepository uRepo)
    {
        userRepo = uRepo;
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
        // Later I will return jwt token here
        return Ok(new
        {
            Message = "Login successful",
            UserId = user.UserId,
            UserName = user.UserName
        });
    }

    public record RegisterDto(string UserName, string Email, string Password);
    public record LoginDto(string UserName, string Password);

}