using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs.CategoryDTO;

public class CategoryResponseDTO
{
    public int CategoryId { get; set; }
    [Required] [StringLength(50)] 
    public string CategoryName { get; set; } = string.Empty;
}