using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs;

public class ThreadUpdateDTO
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
    public string Title { get; set; } = string.Empty;
    [Required]
    [StringLength(2000, MinimumLength = 3, ErrorMessage = "Content must be between 3 and 2000 cahracters")]
    public string Content { get; set; } = string.Empty;
}