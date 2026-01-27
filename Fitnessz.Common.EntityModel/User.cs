using System.ComponentModel.DataAnnotations;

namespace Fitnessz.Common.EntityModel;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Required] public string Role { get; set; } = "User";
    
    //navigation properties
    public ICollection<ForumThread> Threads { get; set; } = new List<ForumThread>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}