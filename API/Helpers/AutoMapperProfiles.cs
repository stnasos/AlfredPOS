using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>()
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => 
                    src.DateOfBirth.Date));
            CreateMap<AppUser, EmployeeDto>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src =>
                    src.UserRoles.Select(x => x.Role.Name)));
        }
    }
}