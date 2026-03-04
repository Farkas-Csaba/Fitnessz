using System.Collections.Immutable;
using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.DTOs.PaginationDTO;
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
    Task<IEnumerable<ForumThread>> ListAllByCategoryAsync(int categoryId);
    Task<PagedResponseKeyset<ForumThread>> GetThreadsKeysetAsync(int reference, int pageSize);
    Task<PagedResponseKeyset<ForumThread>> GetThreadsByCategoryIdKeysetAsync(int categoryId, int reference, int pageSize);

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
        return await db.ForumThreads.Include(t =>t.User).Include(t => t.Category).FirstOrDefaultAsync(t => t.ThreadId == id); //null reference exception?

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

    public async Task<IEnumerable<ForumThread>> ListAllByCategoryAsync(int categoryId)
    {
        return await db.ForumThreads
            .Include(t => t.User)
            .Include(t => t.Category)
            .Where(t => t.CategoryId == categoryId).ToListAsync();
    }

    public async Task<PagedResponseKeyset<ForumThread>> GetThreadsKeysetAsync(int reference, int pageSize)
    {
        var query = db.ForumThreads.AsNoTracking()
            .Include(t => t.User)
            .Include(c => c.Category)
            .OrderByDescending(x => x.ThreadId);
        List<ForumThread> threads;
        if (reference <= 0) 
        {
            threads = await query.Take(pageSize).ToListAsync();
        }
        else 
        {
            threads = await query.Where(p => p.ThreadId < reference).Take(pageSize).ToListAsync();
        }

        var nextReference = threads.Any() ? threads.Last().ThreadId : -1;
        return new PagedResponseKeyset<ForumThread>(threads, nextReference);
    }

    public async Task<PagedResponseKeyset<ForumThread>> GetThreadsByCategoryIdKeysetAsync(int categoryId, int reference, int pageSize)
    {
        var query = db.ForumThreads.AsNoTracking()
            .Include(t => t.User)
            .Include(t => t.Category)
            .OrderByDescending(t => t.ThreadId);
        List<ForumThread> threads;
        if (reference <= 0)
        {
            threads = await query.Take(pageSize).ToListAsync();
        }
        else
        {
            threads = await query.Where(t => t.CategoryId == categoryId).Where(p => p.ThreadId < reference)
                .ToListAsync();
        }

        int nextReference = threads.Any() ? threads.Last().ThreadId : -1;
        return new PagedResponseKeyset<ForumThread>(threads, nextReference);
    }
}
