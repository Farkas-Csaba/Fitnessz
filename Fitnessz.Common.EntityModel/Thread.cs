using System.ComponentModel.DataAnnotations;

namespace Fitnessz.Common.EntityModel;

public class ForumThread
{
    [Key]
    public int ThreadId { get; set; }
    [Required]
    public string? Title { get; set; } = null;
    
    public DateTime CreatedAt { get; set; }  = DateTime.UtcNow;
    
    public virtual ICollection<Post>? Posts { get; set; } = new List<Post>();
}