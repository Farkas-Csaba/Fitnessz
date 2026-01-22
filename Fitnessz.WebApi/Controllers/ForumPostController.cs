using System.Security.Claims;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Fitnessz.WebApi.Controllers;
[ApiController]
[Route("{controller}")]

public class ForumPostController : ControllerBase
{
    private readonly IForumPostRepository postRepo;
    private readonly IThreadRepository threadRepo;

    public ForumPostController(IForumPostRepository pRepo, IThreadRepository tRepo )
    {
        postRepo = pRepo;
        threadRepo = tRepo;
    }

    [HttpGet("posts/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPostById(int id)
    {
        Post? p = await postRepo.GetPostByIdAsync(id);
        if (p == null)
        {
            return NotFound();
        }

        return Ok(p);
    }
    [HttpGet("{threadId}/posts")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPosts(int threadId) 
    {
        if (!await threadRepo.ExistsAsync(threadId))
        {
            return NotFound();
        }

        var p = await postRepo.GetPostsByThreadIdAsync(threadId);
        return Ok(p);
    }
    [Authorize]
    [HttpPost("{threadId}/posts")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreatePostAsync(int threadId ,[FromBody] Post post)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString))
        {
            return Unauthorized("Invalid Token");
        }
        post.UserId = int.Parse(userIdString); //maybe should use tryparse() here?
        if (!await threadRepo.ExistsAsync(threadId))
        {
            return NotFound();
        }

        post.ThreadId = threadId;
        Post? p = await postRepo.CreatePostAsync(post);
        if (p == null)
        {
            return BadRequest("Couldn't create post");
        }

        
        return CreatedAtAction(
            nameof(GetPostById),
            new { id = p.PostId },
            p);
    }

    [HttpPut("{threadId}/posts/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdatePost(int threadId, int id, [FromBody] Post post)
    {
        if (post.PostId!=0 && id != post.PostId)
        {
            return BadRequest("The id in the Json body and the url do not match");
        }
        if (!await threadRepo.ExistsAsync(threadId))
        {
            return NotFound("Thread not found");
        }

        Post? p = await postRepo.UpdatePostAsync(threadId,id, post);

        if (p == null)
        {
            return NotFound("Post not found in this thread");
        }
        return NoContent();
    }

    [HttpDelete("{threadId}/posts/{postId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePost(int threadId, int postId)
    {
        bool? deleted = await postRepo.DeletePostAsync(threadId, postId);

        if (deleted == null)
        {
            return NotFound("Couldn't delete post");
        }

        if (deleted == false)
        {
            return StatusCode(500, "Couldn't delete comment due to server error");
        }
        return NoContent();
    }
}