using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SimplePostsApi.ViewModels
{
    public class PostViewModel
    {

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Category { get; set; }
        public IFormFile File { get; set; }
    }
}
