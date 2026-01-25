using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IThreadRepository
{
    Task<ForumThread?> RetrieveAsync(int id);
    Task<ForumThread?> AddAsync(ForumThread thread);
    Task<bool> ExistsAsync(int threadId);
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
        return await db.ForumThreads.FirstOrDefaultAsync(t => t.ThreadId == id);

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
        return await db.ForumThreads.AnyAsync(t => t.ThreadId == threadId);
    }
}
