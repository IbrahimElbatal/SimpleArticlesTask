namespace SimplePostsApi.Models
{
    public class AppSettings
    {
        //jwt settings
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public string ExpireIn { get; set; }
        public string SecretKey { get; set; }


        //admin and moderator users
        public string AdminUser { get; set; }
        public string ModeratorUser { get; set; }
        public string Password { get; set; }

    }
}
