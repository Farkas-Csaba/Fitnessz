using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
namespace Fitnessz.Common.EntityModel;


public class User : IdentityUser<int>
{
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  
    
    //navigation properties
    public ICollection<ForumThread> Threads { get; set; } = new List<ForumThread>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}