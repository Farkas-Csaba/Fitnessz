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
    public DateTime CreatedAt { get; set; }  = DateTime.UtcNow; //Added this from Thread entity 
    
    //navigation properties no lazy loading
    public ForumThread? Thread { get; set; }
    public User? User { get; set; } //Changed to nullable after Dto's are in place could reconsider this
    //Also should i do = new User(); here?

}