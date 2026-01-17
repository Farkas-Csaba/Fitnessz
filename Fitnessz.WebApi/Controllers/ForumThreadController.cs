using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.AspNetCore.Mvc;
using Fitnessz.WebApi.Repositories;
using System.ComponentModel.DataAnnotations;
namespace Fitnessz.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumThreadController : ControllerBase
{
    private readonly IThreadRepository threadRepo;
    private readonly ILogger<ForumThreadController> _logger;

    public ForumThreadController(ILogger<ForumThreadController> logger, IThreadRepository tRepo)
    {
        _logger = logger;
        threadRepo = tRepo;
    }

    [HttpGet("{title}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetThread([FromRoute, Required, MinLength(1)]string title)
    {
        
        ForumThread? t =  await threadRepo.RetrieveAsync(title);
        if (t == null)
        {
            return NotFound();
        }

        return Ok(t);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateThread(ForumThread thread)
    {
        ForumThread? t = await threadRepo.AddAsync(thread);
        if (t == null)
        {
            return Conflict("A thread with this title already exists");
        }

        return CreatedAtAction(
            nameof(GetThread),
            new { title = t.Title },
            t);
    }
    
}