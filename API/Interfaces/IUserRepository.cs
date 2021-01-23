using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<AppUser> GetUserByIdAsync(string id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<EmployeeDto> GetEmployeeAsync(string username);
        Task<IEnumerable<EmployeeDto>> GetEmployeesAsync();
        void Update(AppUser user);
    }
}