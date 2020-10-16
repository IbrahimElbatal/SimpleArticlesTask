using System;
using System.ComponentModel.DataAnnotations;

namespace SimplePostsApi.Models
{
    public class Post
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string ImagePath { get; set; }

        [Required]
        public string category { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
    }
}
