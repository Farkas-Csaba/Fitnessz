namespace Fitnessz.Common.EntityModel;

public class Post
{
    public int PostId { get; set; }
    
    public string? Title { get; set; }
    
    public int ThreadId { get; set; }
    
    public virtual Thread? Thread { get; set; }
    
}