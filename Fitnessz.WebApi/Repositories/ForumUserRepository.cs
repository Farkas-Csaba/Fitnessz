using Fitnessz.Common.DataContext;
using Fitnessz.Common.EntityModel;
using BCrypt;
using Microsoft.EntityFrameworkCore;

namespace Fitnessz.WebApi.Repositories;

public interface IForumUserRepository
{
    Task<User?> RegisterUserAsync(User user, string password);
    Task<User?> GetUserByNameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
}
public class ForumUserRepository : IForumUserRepository
{
    private readonly ForumDbContext db;
    public ForumUserRepository(ForumDbContext injectedDb)
    {
        db = injectedDb;
    }
    public async Task<User?> RegisterUserAsync(User user, string password)
    {
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        db.Users.Add(user);
        return (await db.SaveChangesAsync() > 0) ? user : null;

    }

    public async Task<User?> GetUserByNameAsync(string username)
    {
        return await db.Users.FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }
}