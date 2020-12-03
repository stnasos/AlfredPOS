using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class EmployeeDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public ICollection<string> Roles { get; set; }
    }
}