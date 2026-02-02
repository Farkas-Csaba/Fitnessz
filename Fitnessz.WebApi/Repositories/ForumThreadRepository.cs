using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IThreadRepository
{
    Task<ForumThread?> RetrieveAsync(int id);
    Task<ForumThread?> AddAsync(ForumThread thread);
    Task<bool> ExistsAsync(int threadId);
    Task DeleteAsync(ForumThread thread);
    Task UpdateThreadAsync(ForumThread thread);
    Task<IEnumerable<ForumThread>> ListAllAsync(); //What can be null here

}

public class ForumThreadRepository : IThreadRepository
{
    private ForumDbContext db;

    public ForumThreadRepository(ForumDbContext injectedDb)
    {
        db = injectedDb;
    }

    public async Task<ForumThread?> RetrieveAsync(int id)
    {
        return await db.ForumThreads.FirstOrDefaultAsync(t => t.ThreadId == id); //null reference exception?

    }

    public async Task<ForumThread?> AddAsync(ForumThread inThread)
    {
        ForumThread? exists = await RetrieveAsync(inThread.ThreadId);
        if (exists != null)
        {
            throw new ArgumentException("Thread already exists");
        }
        
        db.Add(inThread);

        int affectedRows = await db.SaveChangesAsync();

        if (affectedRows > 0)
        {
            return inThread;
        }

        return null;
    }

    public async Task<bool> ExistsAsync(int threadId)
    {
        return await db.ForumThreads.AnyAsync(t => t.ThreadId == threadId); //is this null reference normal? Look into it
    }

    public async Task DeleteAsync(ForumThread thread)
    {
        db.Remove(thread);
        await db.SaveChangesAsync();
    }

    public async Task UpdateThreadAsync(ForumThread thread)
    {
        await db.SaveChangesAsync();
    }

    public async Task<IEnumerable<ForumThread>> ListAllAsync()
    {
        return await db.ForumThreads
            .Include(t => t.User)
            .Include(t => t.Category)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
