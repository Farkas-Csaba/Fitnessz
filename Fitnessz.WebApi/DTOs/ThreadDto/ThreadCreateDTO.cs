using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs;

public class ThreadCreateDTO
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
    public string Title { get; set; } = string.Empty;

    [Required] //this changed after vadding Content
    [StringLength(2000, MinimumLength = 3, ErrorMessage = "Content must be between 3 and 300 cahracters")]
    public string Content { get; set; } = string.Empty;
}