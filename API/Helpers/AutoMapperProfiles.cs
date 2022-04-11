using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, UserUpdateDto>();
            CreateMap<UserUpdateDto, AppUser>();
            CreateMap<UserDeleteDto, AppUser>();
            CreateMap<AppUser, UserDeleteDto>();
        }
    }
}