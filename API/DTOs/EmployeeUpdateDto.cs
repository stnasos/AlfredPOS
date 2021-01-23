using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class EmployeeUpdateDto
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}