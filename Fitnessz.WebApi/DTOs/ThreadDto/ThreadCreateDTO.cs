using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs;

public class ThreadCreateDTO
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
    public string Title { get; set; } = string.Empty;

   
    [StringLength(2000, MinimumLength = 0, ErrorMessage = "Content must be between 0 and 2000 cahracters")]
    public string Content { get; set; } = string.Empty;
    [Required]
    public int CategoryId { get; set; }
}