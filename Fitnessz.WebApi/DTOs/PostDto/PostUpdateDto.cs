using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs.PostDto;

public class PostUpdateDto
{
    [Required]
    [StringLength(200, ErrorMessage = "The Content needs to be between 1 and 200 characters", MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;
}