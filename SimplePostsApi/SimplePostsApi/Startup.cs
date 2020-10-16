using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SimplePostsApi.Models;
using System;
using System.Security.Claims;
using System.Text;

namespace SimplePostsApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //inject appsetting to be used in dependancy injection
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            //configure services to use sql server
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });


            //adding identity services
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                //configure password options
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;

                //configure User options
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            //configure services to uses jwt

            var appSettings = Configuration
                .GetSection("AppSettings")
                .Get<AppSettings>();

            //key secret in jwt 
            var key = Encoding.UTF8.GetBytes(appSettings.SecretKey);
            services.AddAuthentication(options =>
            {
                //adding jwt services
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    //validate jwt settings
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = appSettings.Issuer,
                        ValidAudience = appSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization(options =>
             {
                 //policy for Admin to Add new Articles

                 options.AddPolicy("AddPosts", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"));

                 //policy for Admin or Moderator to Edit new Articles or comments
                 options.AddPolicy("EditPostsOrComments",
                   policy => policy.RequireAssertion(
                       handle => handle.User.IsInRole("Admin") ||
                       handle.User.IsInRole("Moderator")
                       ));

                 //policy for moderator to edit Posts
                 //options.AddPolicy("EditArticles", policy => policy.RequireClaim(ClaimTypes.Role, "Moderator"));
             });



            services.AddMvc(options =>
            {
                //adding Authorization filter global
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);


            //enable cors
            services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", c =>
                    c.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseCors("MyPolicy");

            //creating Admin User and moderator user
            DbInitializer.InitializeDb(app, Configuration);


            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
        }
    }
}
