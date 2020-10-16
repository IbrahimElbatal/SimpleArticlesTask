using System.ComponentModel.DataAnnotations;

namespace SimplePostsApi.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [Display(Name = "User Name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
