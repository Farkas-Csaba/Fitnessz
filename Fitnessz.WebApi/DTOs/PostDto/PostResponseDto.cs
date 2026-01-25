using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs.PostDto;

public class PostResponseDto
{
    public int PostId { get; set; }
    [Required] public string Content { get; set; } = string.Empty;
    public string AuthorName { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
}