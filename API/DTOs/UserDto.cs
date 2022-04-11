using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public bool Status { get; set; }
        public DateTime CreationDate { get; set; }
    }
}