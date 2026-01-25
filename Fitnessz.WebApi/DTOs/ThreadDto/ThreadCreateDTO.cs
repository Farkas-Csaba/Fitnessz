using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs;

public class ThreadCreateDTO
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
    public string Title { get; set; } = string.Empty;
}