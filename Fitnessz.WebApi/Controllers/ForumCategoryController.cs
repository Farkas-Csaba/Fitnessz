using Fitnessz.Common.EntityModel;
using Fitnessz.WebApi.DTOs.CategoryDTO;
using Fitnessz.WebApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitnessz.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumCategoryController : ControllerBase
{
    private readonly IForumCategory categoryRepo;

    public ForumCategoryController(IForumCategory cRepo)
    {
        categoryRepo = cRepo;
    }
  
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await categoryRepo.GetCategoriesAsync();

        var response = categories.Select(c => new CategoryResponseDTO()
        {
            CategoryId = c.CategoryId,
            Name = c.Name
        });
        return Ok(response);
    }
    
}