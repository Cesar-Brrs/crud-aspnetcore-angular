using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(UserDto userDto)
        {
            if (await UserExists(userDto.Username, userDto.Email)) return BadRequest("Ya existe el usuario.");
            
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                Username = userDto.Username.ToLower(),
                Email = userDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password)),
                PasswordSalt = hmac.Key,
                Status = userDto.Status,
                Gender = userDto.Gender
            };

            _context.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        [HttpPut("updateUser/{userId}")]
        public async Task<ActionResult> UpdateUser(int userId, UserUpdateDto userUpdateDto)
        {
            var user = await _context.Users.FindAsync(userUpdateDto.Id);

            _mapper.Map(userUpdateDto, user);

            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userUpdateDto.Password));
            user.PasswordSalt = hmac.Key;
            
            _context.Entry(user).State = EntityState.Modified;

            if (await _context.SaveChangesAsync() > 0) return NoContent();

            return BadRequest("Error con actualizar el usuario.");
        }

        [HttpPut("deleteUser/{userId}")]
        public async Task<ActionResult<AppUser>> DeleteUser(int userId, UserDeleteDto userDeleteDto)
        {
            var user = await _context.Users.FindAsync(userDeleteDto.Id);

            _mapper.Map(userDeleteDto, user);

            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            // return Ok("Usuario inactivo.");
            return user;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null) return Unauthorized("Usuario incorrecto.");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Contraseña incorrecta.");
                }
            }

            return user;
        }

        private async Task<bool> UserExists(string username, string email)
        {
            return await _context.Users.AnyAsync(u => u.Username == username.ToLower() && u.Email == email.ToLower());
        }
    }
}