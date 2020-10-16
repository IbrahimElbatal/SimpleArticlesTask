using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SimplePostsApi.Models;
using SimplePostsApi.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SimplePostsApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppSettings _appSettings;

        public AccountController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<AppSettings> appSettings)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                ModelState.AddModelError(string.Empty, "the data aren't valid");
                return BadRequest(model);
            }

            var user = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Visitor");
                return Ok(new { status = "1" });

            }
            else
                return BadRequest(result.Errors.Select(e => new { code = e.Code, description = e.Description }));
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            if (!ModelState.IsValid)
            {
                ModelState.AddModelError(string.Empty, "the data aren't valid");
                return BadRequest(model);
            }

            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
                return NotFound("User doesn't Exist");

            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!result)
                return NotFound("UserName Or Password doesn't correct");

            var userRoles = (await _userManager.GetRolesAsync(user)).ToArray();
            var encodedToken = GenerateJwtToken(user, userRoles, out DateTime expireIn);

            return Ok(new { jwtToken = encodedToken, userName = user.UserName, roles = userRoles, expireIn = expireIn });
        }

        private string GenerateJwtToken(ApplicationUser user, string[] userRoles, out DateTime expireIn)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.SecretKey));

            var handler = new JwtSecurityTokenHandler();

            var descriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(
                    new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.Email, user.Email),
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                        new Claim(ClaimTypes.Role , userRoles.FirstOrDefault()),
                    }),
                Audience = _appSettings.Audience,
                Issuer = _appSettings.Issuer,
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_appSettings.ExpireIn)),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            };
            var token = handler.CreateToken(descriptor);
            var encodedToken = handler.WriteToken(token);
            expireIn = token.ValidTo;
            return encodedToken;
        }
    }
}