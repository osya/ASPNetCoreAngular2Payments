using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using ASPNetCoreAngular2YoExample.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ASPNetCoreAngular2YoExample.Controllers
{
    [Route("api/[controller]")]
    public class Users : Controller
    {
        private UserManager<IdentityUser> UserManager { get; set; }
        private SignInManager<IdentityUser> SignInManager { get; set; }

        public Users(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager?.Dispose();
            }
            base.Dispose(disposing);
        }

        // GET: api/values
        //        [HttpGet]
        //        public IEnumerable<string> Get()
        //        {
        //            return new string[] { "value1", "value2" };
        //        }

        // GET api/values/5
        //        [HttpGet("{id}")]
        //        public string Get(int id)
        //        {
        //            return "value";
        //        }

        // POST api/values
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> Post([FromBody]UserViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, false);
                
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");
                
                    return Ok();
                }
                var props = model.GetType().GetProperties();
                var errors = result.Errors.ToList();
                var i = 0;
                while (i < errors.Count)
                {
                    var deleted = false;
                    foreach (var prop in props)
                    {
                        if (!errors[i].Description.Contains(prop.Name)) continue;
                        ModelState.AddModelError(prop.ToString().Split(' ').Last(), errors[i].Description);
                        errors.Remove(errors[i]);
                        deleted = true;
                        break;
                    }
                    if (!deleted)
                    {
                        i++;
                    }
                }
                if (errors.Count > 0)
                {
                    foreach (var error in errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }
            return BadRequest(ModelState.Where(pair => pair.Value.Errors.Count > 0)
                .ToDictionary(pair => pair.Key, pair => pair.Value.Errors.Select(error => error.ErrorMessage)));
        }

        [HttpGet("version")]
        [AllowAnonymous]
        public IActionResult MyResult()
        {
            return Ok();
        }

        // PUT api/values/5
        //        [HttpPut("{id}")]
        //        public void Put(int id, [FromBody]string value)
        //        {
        //        }

        // DELETE api/values/5
        //        [HttpDelete("{id}")]
        //        public void Delete(int id)
        //        {
        //        }
    }
}
