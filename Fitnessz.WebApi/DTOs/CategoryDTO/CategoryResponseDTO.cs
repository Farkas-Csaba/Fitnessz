using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs.CategoryDTO;

public class CategoryResponseDTO
{
    public int CategoryId { get; set; }
    [Required] [StringLength(50)] 
    public string Name { get; set; } = string.Empty;
}