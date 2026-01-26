using System.ComponentModel.DataAnnotations;

namespace Fitnessz.Common.EntityModel;

public class Category
{
    public int CategoryId { get; set; }
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = String.Empty;
    
    //navigation properties
    public ICollection<ForumThread> Threads { get; set; } = new List<ForumThread>();

}