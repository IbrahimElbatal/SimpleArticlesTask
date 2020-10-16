using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimplePostsApi.Models;
using SimplePostsApi.ViewModels;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SimplePostsApi.Controllers
{
    [Route("api/[controller]")]

    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHostingEnvironment _environment;

        public PostsController(ApplicationDbContext context, IHostingEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.Posts.ToListAsync());
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "AddPosts")]
        public async Task<IActionResult> CreatePost(PostViewModel model)
        {
            if (!ModelState.IsValid)
            {
                ModelState.AddModelError(string.Empty, "Data isn't valid");
                return BadRequest("data not vaild");
            }

            if (model.File == null)
                return BadRequest("file not uploaded");

            try
            {
                var directory = Path.Combine(_environment.WebRootPath, "Images");
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                var fileNameExtension = new FileInfo(model.File.FileName).Extension;
                var fileName = $"img_{DateTime.Now.ToString("dd.MM.yyyy HH.mm.ss")}{fileNameExtension}";

                var stream = new FileStream(Path.Combine(directory, fileName), FileMode.Create, FileAccess.ReadWrite);
                await model.File.CopyToAsync(stream);

                var post = new Post()
                {
                    Title = model.Title,
                    Description = model.Description,
                    category = model.Category,
                    ImagePath = Path.Combine("Images", fileName)
                };

                await _context.Posts.AddAsync(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Created Successfully.", Admin = User.IsInRole("Admin"), moderator = User.IsInRole("Moderator") });
            }
            catch (Exception e)
            {
                ModelState.AddModelError(string.Empty, e.Message);
                return BadRequest("Error happens");
            }

        }


        [HttpPut("[action]/{id:int}")]
        [Authorize(Policy = "EditPostsOrComments")]
        public async Task<IActionResult> EditPost([FromRoute]int id, PostViewModel model)
        {
            if (!ModelState.IsValid)
            {
                ModelState.AddModelError(string.Empty, "Data isn't valid");
                return BadRequest("Model error");
            }

            var postInDb = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            if (postInDb == null)
                return NotFound();

            var imagePath = "";
            if (model.File == null)
                imagePath = postInDb.ImagePath;
            else
            {
                var directory = Path.Combine(_environment.WebRootPath, "Images");
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                var fileNameExtension = new FileInfo(model.File.FileName).Extension;
                var fileName = $"img_{DateTime.Now.ToString("dd.MM.yyyy HH.mm.ss")}{fileNameExtension}";

                var stream = new FileStream(Path.Combine(directory, fileName), FileMode.Create, FileAccess.ReadWrite);
                await model.File.CopyToAsync(stream);

                imagePath = Path.Combine("Images", fileName);
            }
            try
            {
                postInDb.Title = model.Title;
                postInDb.Description = model.Description;
                postInDb.ImagePath = imagePath;
                postInDb.category = model.Category;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Updated Successfully." });
            }
            catch (Exception e)
            {
                ModelState.AddModelError(string.Empty, e.Message);
                return BadRequest("Error happens" + e.Message);
            }

        }

    }
}
