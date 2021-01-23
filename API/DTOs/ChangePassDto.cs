using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ChangePassDto
    {
        public string OldPassword { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 6)]
        public string NewPassword { get; set; }
    }
}