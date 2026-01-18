using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitnessz.Common.EntityModel;

public class ForumThread
{
    [Key]
    public int ThreadId { get; set; }
    public int UserId { get; set; }
    [Required]
    public string? Title { get; set; } = null;
    public DateTime CreatedAt { get; set; }  = DateTime.UtcNow;
    
    //navigation properties
    public ICollection<Post>? Posts { get; set; } = new List<Post>();
    public User User { get; set; } = null!; //Can this actuaally be null?
}