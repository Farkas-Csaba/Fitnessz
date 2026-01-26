using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.AspNetCore.Mvc;
using Fitnessz.WebApi.Repositories;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Fitnessz.WebApi.DTOs;
namespace Fitnessz.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumThreadController : ControllerBase
{
    private readonly IThreadRepository threadRepo;
    private readonly IForumCategory categoryRepo;
    private readonly ILogger<ForumThreadController> _logger;

    public ForumThreadController(ILogger<ForumThreadController> logger, IThreadRepository tRepo, IForumCategory cRepo)
    {
        _logger = logger;
        threadRepo = tRepo;
        categoryRepo = cRepo;
    }
    
    [HttpGet("{id:int}", Name = nameof(GetThreadById))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetThreadById(int id)
    {
        
        ForumThread? thread =  await threadRepo.RetrieveAsync(id);
        if (thread == null)
        {
            return NotFound();
        }

        ThreadResponseDTO response = new ThreadResponseDTO()
        {
            ThreadId = thread.ThreadId,
            Title = thread.Title,
            Content = thread.Content,
            AuthorName = thread.User?.UserName ?? "Unknown",
            CategoryId = thread.CategoryId
            
        };
        return Ok(response);
    }
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateThread([FromBody]ThreadCreateDTO dto)
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? userName = User.Identity?.Name;
        if (string.IsNullOrEmpty(userIdString) || (string.IsNullOrEmpty(userName)))
        {
            return Unauthorized("Invalid Token");
        }

        if (!await categoryRepo.CategoryExists(dto.CategoryId))
        {
            return BadRequest("Category not found");
        }
        ForumThread thread = new()
        {
            UserId = int.Parse(userIdString), //check this later, is this fine here, what about TryParse()
            Title = dto.Title,
            Content = dto.Content,
            CategoryId = dto.CategoryId //Added this after adding the Category entity
        };
        
        ForumThread? createdThread = await threadRepo.AddAsync(thread);
        if (createdThread == null)
        {
            return Conflict("A thread with this title already exists");
        }

        ThreadResponseDTO response = new ThreadResponseDTO()
        {
            AuthorName = userName,
            Title = createdThread.Title,
            ThreadId = createdThread.ThreadId,
            Content = createdThread.Content,
            CategoryId = createdThread.CategoryId
        };
        return CreatedAtAction(
            nameof(GetThreadById),
            new { id = response.ThreadId }, 
            response);
    }

    [Authorize]
    [HttpDelete("{threadId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteThread(int threadId)
    {
        string? stringUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(stringUserId))
        {
            return Unauthorized("Invalid token credential");
        }

        int userId = int.Parse(stringUserId);
        
        ForumThread? existingThread = await threadRepo.RetrieveAsync(threadId);
        if (existingThread == null)
        {
            return NotFound("Post does not exist");
        }
        bool isAdmin = User.IsInRole("Admin");
        bool isOwner = existingThread.UserId == userId;

        if (!isOwner && !isAdmin)
        {
            return Forbid();
        }

        await threadRepo.DeleteAsync(existingThread);

        return NoContent();
    }
    [Authorize]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateThread(int id, [FromBody] ThreadUpdateDTO dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int useriD)) //?ask about this structure
        {
            return Unauthorized();
        }

        ForumThread? existingThread = await threadRepo.RetrieveAsync(id);
        if (existingThread == null)
        {
            return NotFound();
        }

        bool isOwner = existingThread.UserId == useriD;
        bool isAdmin = User.IsInRole("Admin");

        if (!isOwner && !isAdmin)
        {
            return Forbid();
        }

        existingThread.Title = dto.Title;
        existingThread.Content = dto.Content;

        await threadRepo.UpdateThreadAsync(existingThread);
        
        return NoContent();

    }
}