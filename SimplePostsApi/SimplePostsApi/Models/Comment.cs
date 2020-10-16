using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimplePostsApi.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Text { get; set; }

        public bool IsApproved { get; set; } = false;
        public string Reason { get; set; }

        [ForeignKey("post")]
        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
