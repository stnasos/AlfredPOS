using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        public AdminController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost("add")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<ActionResult<EmployeeDto>> Add(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var emp = _mapper.Map<EmployeeDto>(user);

            return Ok(emp);
        }

        [HttpDelete("remove/{username}")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<ActionResult> RemoveUser(string username)
        {
            if (username.ToLower() == User.GetUsername())
                return BadRequest("You cannot delete current user");

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            user.Deleted = true;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("User removed successfully");
        }

        [HttpPut("reactivate/{username}")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<ActionResult> ReactivateUser(string username)
        {
            if (username.ToLower() == User.GetUsername()) return BadRequest("User already active");

            var user = await _userManager.Users.IgnoreQueryFilters()
                                .Where(u => u.NormalizedUserName == username.ToUpper())
                                .SingleOrDefaultAsync();

            if (user == null) return NotFound("Could not find user");

            if (!user.Deleted) return BadRequest("User already active");

            user.Deleted = false;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Failed to reactivate user");

            var employee = _mapper.Map<EmployeeDto>(user);
            return Ok(employee);
        }

        [HttpPut("edit-roles/{username}")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<ActionResult> EditUserRoles(string username, EditUserRolesDto editUserRolesDto)
        {
            bool currentUser = username.ToLower() == User.GetUsername();

            if (currentUser && !editUserRolesDto.Roles.Contains("Admin"))
                return BadRequest("You cannot remove admin role from current user");

            var user = await _userManager.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Where(u => u.NormalizedUserName == username.ToUpper())
                .SingleOrDefaultAsync();

            if (user == null) return NotFound("Could not find user");

            var userRoles = user.UserRoles.Select(ur => ur.Role.Name);

            var result = await _userManager.AddToRolesAsync(user, editUserRolesDto.Roles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(editUserRolesDto.Roles));
            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            if (currentUser)
            {
                return Ok(new UserDto
                {
                    Username = user.UserName,
                    Token = await _tokenService.CreateToken(user)
                });
            }

            return NoContent();
        }

        [HttpPut("update/{username}")]
        [Authorize(Policy = "RequireAdminManager")]
        public async Task<ActionResult> UpdatedUserInfo(string username, EmployeeUpdateDto employeeUpdateDto)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            if (User.GetUsername() != username.ToLower())
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (userRoles.Contains("Admin"))
                    return StatusCode((int)HttpStatusCode.Forbidden, "You cannot update another admin's profile");
                if (userRoles.Contains("Manager") && !(User.IsInRole("Admin")))
                    return StatusCode((int)HttpStatusCode.Forbidden, "You cannot update another manager's profile");
            }

            _mapper.Map(employeeUpdateDto, user);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPut("change-pass/{username}")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<ActionResult> ChangePassword(string username, ChangePassDto changePassDto)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            /*if (await _userManager.IsInRoleAsync(user, "Admin"))
                return StatusCode((int)HttpStatusCode.Forbidden, "You can't change another admin's password");
            */
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, changePassDto.NewPassword);

            if (!result.Succeeded) return BadRequest("Failed to change password");

            return Ok("Password changed successfully");
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
        }
    }
}