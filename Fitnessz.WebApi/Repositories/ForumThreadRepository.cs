using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IThreadRepository
{
    Task<ForumThread?> RetrieveAsync(string title);
    Task<ForumThread?> AddAsync(ForumThread thread);
}

public class ForumThreadRepository : IThreadRepository
{
    private ForumDbContext db;

    public ForumThreadRepository(ForumDbContext injectedDb)
    {
        db = injectedDb;
    }

    public async Task<ForumThread?> RetrieveAsync(string title)
    {
        return await db.ForumThreads.FirstOrDefaultAsync(t => t.Title == title);

    }

    public async Task<ForumThread?> AddAsync(ForumThread inThread)
    {
        ForumThread? exists = await RetrieveAsync(inThread.Title);
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
}
