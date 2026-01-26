using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitnessz.Common.EntityModel;

public class ForumThread
{
    [Key]
    public int ThreadId { get; set; }
    [Required]
    public int CategoryId { get; set; }
    public int UserId { get; set; }
    [Required] 
    public string Title { get; set; } = string.Empty;
    [Column(TypeName = "text")]
    public string? Content { get; set; } = null;
    public DateTime CreatedAt { get; set; }  = DateTime.UtcNow;
    
    //navigation properties
    [ForeignKey(nameof(CategoryId))]
    public Category? Category { get; set; }
    public ICollection<Post>? Posts { get; set; } = new List<Post>();
    public User? User { get; set; } //Changed to nullable after Dto's are in place could reconsider this
}