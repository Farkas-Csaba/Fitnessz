namespace Fitnessz.Common.EntityModel;
using System.ComponentModel.DataAnnotations;

public class Post
{
    [Key]
    public int PostId { get; set; }
    [Required]
    public string? Content { get; set; }
    public int ThreadId { get; set; }
    public int UserId { get; set; }
    
    //navigation properties no lazy loading
    public ForumThread? Thread { get; set; }
    public User User { get; set; } = null!;

}