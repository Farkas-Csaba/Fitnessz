using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IForumPostRepository
{
    Task<IEnumerable<Post>?> GetPostsByThreadIdAsync(int threadId);
    Task<Post?> CreatePostAsync(Post post);
    Task<Post?> GetPostByIdAsync(int postId);
    Task<Post?> UpdatePostAsync(int threadId, int id,Post post);
    Task<bool?> DeletePostAsync(int threadId, int postId);
}

public class ForumPostRepository : IForumPostRepository
{
    private readonly ForumDbContext db;
    public ForumPostRepository(ForumDbContext injectedDb)
    {
        db = injectedDb;
    }
    public async Task<IEnumerable<Post>?> GetPostsByThreadIdAsync(int threadId) 
    {
        return await db.Posts
            .Where(p => p.ThreadId == threadId)
            .ToListAsync();
        
    }

    public async Task<Post?> CreatePostAsync(Post post)
    {
        db.Add(post);
        return (await db.SaveChangesAsync() > 0) ? post : null;
    }

    public async Task<bool?> DeletePostAsync(int threadId, int postId)
    {
        Post? p = await db.Posts.FindAsync(postId);

        if (p == null || p.ThreadId != threadId)
        {
            return null;
        }
        
        db.Posts.Remove(p);
        return await db.SaveChangesAsync() > 0;
    }

    public async Task<Post?> UpdatePostAsync(int threadId,int id, Post updatedPost)
    {
        Post? existingPost = await GetPostByIdAsync(id);
        if (existingPost == null || existingPost.ThreadId != threadId)
        {
            return null;
        }

        if (existingPost.Content != updatedPost.Content)
        {
            existingPost.Content = updatedPost.Content;
            await db.SaveChangesAsync();
        }
        return existingPost;
    }

    public async Task<Post?> GetPostByIdAsync(int postId)
    {
        return await db.Posts.FindAsync(postId);
    }
}