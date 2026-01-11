namespace Fitnessz.Common.EntityModel;

public class Thread
{
    public int ThreadId { get; set; }
    
    public required string Title { get; set; }
    
    public DateTime CreatedAt { get; set; }  = DateTime.UtcNow;
    
    public virtual ICollection<Post>? Posts { get; set; } = new List<Post>();
}