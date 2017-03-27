using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ASPNetCoreAngular2Payments.Controllers
{
    public class AccountController : Controller
    {
        private UserManager<IdentityUser> UserManager { get; set; }

        public AccountController(UserManager<IdentityUser> userManager)
        {
            UserManager = userManager;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        // todo: This controller is for password changing testing only. Delete it after testing
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ChangePass(string email, string newpass)
        {
            var user = UserManager.FindByNameAsync(email).Result;
            if (user != null)
            {
                var t = await UserManager.GeneratePasswordResetTokenAsync(user);
                var e = await UserManager.ResetPasswordAsync(user, t, newpass);
                var test = await UserManager.CheckPasswordAsync(user, newpass);
            }
            return View();
        }
    }
}
