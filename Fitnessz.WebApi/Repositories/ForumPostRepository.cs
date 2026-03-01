using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IForumPostRepository
{
    Task<IEnumerable<Post>?> GetPostsByThreadIdAsync(int threadId);
    Task<Post?> CreatePostAsync(Post post);
    Task<Post?> GetPostByIdWithUserAsync(int postId);
    Task UpdatePostAsync(Post post);
    Task DeletePostAsync(Post post);
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
            .Include(p => p.User)
            .Where(p => p.ThreadId == threadId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Post?> CreatePostAsync(Post post)
    {
        db.Add(post);
        return (await db.SaveChangesAsync() > 0) ? post : null;
    }

    public async Task DeletePostAsync(Post post)
    {
        db.Posts.Remove(post);
        await db.SaveChangesAsync();

    }

    public async Task UpdatePostAsync(Post updatedPost)
    {
        await db.SaveChangesAsync();
    }

    public async Task<Post?> GetPostByIdWithUserAsync(int postId) //eager loading the User
    {
        return await db.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.PostId == postId);
    }
    
}