using System.ComponentModel.DataAnnotations;

namespace SimplePostsApi.ViewModels
{
    public class CommentEdit
    {
        public bool IsApproved { get; set; }

        [Required]
        public string Reason { get; set; }
    }
}
