using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(15, MinimumLength = 5)]
        [RegularExpression("^[a-z0-9.]*$", ErrorMessage = "Only the following characters are allowed for username: (a-z), (0-9), (.)")]
        public string Username { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 6)]
        public string Password { get; set; }
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }

        private string _email;
        [EmailAddress] public string Email { get { return _email; } set { _email = string.IsNullOrWhiteSpace(value) ? null : value; } }
        [Phone] public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}