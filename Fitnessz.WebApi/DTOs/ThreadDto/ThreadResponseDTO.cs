using System.ComponentModel.DataAnnotations;

namespace Fitnessz.WebApi.DTOs;

public class ThreadResponseDTO
{
    public int ThreadId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;  
    public string AuthorName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    
    
}