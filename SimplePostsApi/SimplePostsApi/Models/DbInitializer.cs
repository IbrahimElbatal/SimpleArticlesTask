using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace SimplePostsApi.Models
{
    public static class DbInitializer
    {

        public static void InitializeDb(IApplicationBuilder app, IConfiguration configuration)
        {
            //creating Admin User and moderator user
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var userManager = scope.ServiceProvider
                    .GetRequiredService<UserManager<ApplicationUser>>();

                var roleManager = scope.ServiceProvider
                    .GetRequiredService<RoleManager<IdentityRole>>();

                var appSettings = configuration.GetSection("AppSettings")
                    .Get<AppSettings>();

                var adminRole = new IdentityRole("Admin");
                var moderatorRole = new IdentityRole("Moderator");
                var visitorRole = new IdentityRole("Visitor");

                roleManager.CreateAsync(adminRole).Wait();
                roleManager.CreateAsync(moderatorRole).Wait();
                roleManager.CreateAsync(visitorRole).Wait();

                var adminUser = new ApplicationUser()
                {
                    UserName = appSettings.AdminUser,
                    Email = appSettings.AdminUser + "@gmail.com"
                };

                var moderatorUser = new ApplicationUser()
                {
                    UserName = appSettings.ModeratorUser,
                    Email = appSettings.ModeratorUser + "@gmail.com"
                };

                userManager.CreateAsync(adminUser, appSettings.Password).Wait();
                userManager.CreateAsync(moderatorUser, appSettings.Password).Wait();

                if (roleManager.Roles.Any())
                {
                    if (userManager.Users.Any())
                    {
                        userManager.AddToRoleAsync(adminUser, adminRole.Name).Wait();
                        userManager.AddToRoleAsync(moderatorUser, moderatorRole.Name).Wait();
                    }
                }
            }

        }
    }
}
