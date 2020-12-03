using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class TestController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        public TestController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet("current-user")]
        public async Task<ActionResult> GetCurrentUser()
        {
            var userId = User.GetUserId();
            return Ok(await _userManager.FindByIdAsync(userId));
        }

        [HttpGet("roles")]
        public async Task<ActionResult> GetRoles()
        {
            if (!await _roleManager.RoleExistsAsync("waiter"))
            {
                await _roleManager.CreateAsync(new AppRole
                {
                    Name = "waiter"
                });
                await _roleManager.CreateAsync(new AppRole
                {
                    Name = "manager"
                });
                await _roleManager.CreateAsync(new AppRole
                {
                    Name = "admin"
                });
            }
            return Ok(await _roleManager.Roles.ToListAsync());
        }

        [HttpGet("user-roles")]
        public async Task<ActionResult> GetUserRoles()
        {
            var userId = User.GetUserId();
            var user = await _userManager.FindByIdAsync(userId);
            
            var result = await _userManager.AddToRolesAsync(user, new List<string>() {"admin", "manager", "waiter"});
            if (!result.Succeeded) return BadRequest(result.Errors);
            
            var resp = new 
            {
                username = user.UserName,
                roles = await _userManager.GetRolesAsync(user)
            };

            return Ok(resp);
        }
    }
}