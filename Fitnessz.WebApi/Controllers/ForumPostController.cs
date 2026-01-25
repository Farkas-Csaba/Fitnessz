using System.Security.Claims;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Fitnessz.WebApi.DTOs.PostDto;

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
        Post? p = await postRepo.GetPostByIdWithUserAsync(id);
        if (p == null)
        {
            return NotFound();
        }

        return Ok(new PostResponseDto()
        {
            AuthorName = p.User.UserName, //this should never be null why is it like this
            Content = p.Content, //same here
            PostId = p.PostId,
            CreatedAt = p.CreatedAt
        });
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

        var posts = await postRepo.GetPostsByThreadIdAsync(threadId);

        var response = posts.Select(p => new PostResponseDto()
        {
            AuthorName = p.User?.UserName ?? "Anonymus",
            Content = p.Content,
            CreatedAt = p.CreatedAt,
            PostId = p.PostId
            
        });
        return Ok(response);
    }
    [Authorize]
    [HttpPost("{threadId}/posts")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreatePostAsync(int threadId ,[FromBody] PostCreateDto dto)
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? userName = User.Identity?.Name;
        if ((string.IsNullOrEmpty(userIdString)) || (string.IsNullOrEmpty(userName)))
        {
            return Unauthorized("Invalid Token");
        }
        if (!await threadRepo.ExistsAsync(threadId))
        {
            return NotFound();
        }

        Post? createdPost = new Post()
        {
            Content = dto.Content,
            ThreadId = threadId,
            UserId = int.Parse(userIdString)
        };
        Post? p = await postRepo.CreatePostAsync(createdPost);
        if (p == null)
        {
            return BadRequest("Couldn't create post");
        }

        PostResponseDto response = new PostResponseDto()
        {
            PostId = p.PostId,
            AuthorName = userName,
            Content = p.Content,
            CreatedAt = p.CreatedAt
        };
        
        return CreatedAtAction(
            nameof(GetPostById),
            new { id = response.PostId },
            response);
    }
    [Authorize]
    [HttpPut("{threadId}/posts/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdatePost(int threadId, int id, [FromBody] PostUpdateDto postDto)
    {
        string? stringUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(stringUserId))
        {
            return Unauthorized("Invalid token credentials");
        }

        int currentUserId = int.Parse(stringUserId);
        
        Post? existingPost = await postRepo.GetPostByIdWithUserAsync(id);

        if (existingPost == null) return NotFound("Post not found");
       
        if (existingPost.ThreadId!=threadId)
        {
            return NotFound("Post does not belong to this thread");
        }

        bool isOwner = existingPost.UserId == currentUserId;
        bool isAdmin = User.IsInRole("admin");
        if (!isOwner && !isAdmin) //Roles, get back to this later 
        {
            return Forbid();
        }

        existingPost.Content = postDto.Content;
        await postRepo.UpdatePostAsync(existingPost);

        return NoContent();
    }
    [Authorize]
    [HttpDelete("{threadId}/posts/{postId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePost(int threadId, int postId)
    {
        string? stringUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(stringUserId))
        {
            return Unauthorized("Invalid token credentials");
        }

        int currentUserId = int.Parse(stringUserId);
        
        
        Post? existingPost = await postRepo.GetPostByIdWithUserAsync(postId);

        if (existingPost == null || existingPost.ThreadId != threadId)
        {
            return NotFound();
        }
        
        bool isOwner = existingPost.UserId == currentUserId;
        bool isAdmin = User.IsInRole("admin");
        if (!isOwner && !isAdmin) //Roles, get back to this later 
        {
            return Forbid();
        }

        await postRepo.DeletePostAsync(existingPost);
        return NoContent();
    }
}