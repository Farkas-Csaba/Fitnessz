namespace Fitnessz.WebApi.DTOs;

public class ThreadResponseDTO
{
    public int ThreadId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = String.Empty;  //this changed after adding Content
    public string AuthorName { get; set; } = string.Empty;
    
}