namespace Fitnessz.Common.EntityModel;
using System.ComponentModel.DataAnnotations;

public class Post
{
    [Key]
    public int PostId { get; set; }
    
    public string? Content { get; set; }
    
    public int ThreadId { get; set; }
    
    public virtual ForumThread? Thread { get; set; }
    
}