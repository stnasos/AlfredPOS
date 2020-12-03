using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser
    {
        public DateTime DateOfBirth { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}