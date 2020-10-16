using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimplePostsApi.Models;
using SimplePostsApi.ViewModels;
using System;
using System.Threading.Tasks;

namespace SimplePostsApi.Controllers
{
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public CommentController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Get()
        {
            return Ok(await context.Comments.ToListAsync());
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateComment([FromBody]Comment comment)
        {
            if (!ModelState.IsValid)
                return BadRequest("validation error");

            try
            {
                await context.Comments.AddAsync(comment);
                await context.SaveChangesAsync();
                return Ok(new { Message = "Comment Created" });
            }
            catch (Exception e)
            {
                return BadRequest("Error happens : Message - " + e.Message);
            }

        }

        [HttpPut("[action]/{id:int}")]
        [Authorize(Policy = "EditPostsOrComments")]
        public async Task<IActionResult> EditComment([FromRoute]int id, [FromBody] CommentEdit edit)
        {
            if (!ModelState.IsValid)
                return BadRequest("validation error");

            var commentInDb = await context.Comments.FirstOrDefaultAsync(c => c.Id == id);
            if (commentInDb == null)
                return NotFound("No Comment Found");

            try
            {
                commentInDb.IsApproved = edit.IsApproved;
                commentInDb.Reason = edit.Reason;

                await context.SaveChangesAsync();
                return Ok(new { Message = "Admin Approved Or not Successfully" });
            }
            catch (Exception e)
            {
                return BadRequest("Error happens : Message - " + e.Message);
            }

        }
    }
}
