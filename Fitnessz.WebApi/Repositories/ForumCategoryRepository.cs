using Fitnessz.Common.DataContext;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;
using Fitnessz.Common.EntityModel;

public interface IForumCategory
{
    
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<bool> CategoryExists(int categoryId);


}
public class ForumCategoryRepository : IForumCategory
{
    private readonly ForumDbContext db;

    public ForumCategoryRepository(ForumDbContext injectedDb)
    {
        db = injectedDb;
    }
   
    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await db.Categories.ToListAsync();
        
    }

    public async Task<bool> CategoryExists(int categoryId)
    {
        return await db.Categories.AnyAsync(c => c.CategoryId == categoryId);
    }
}