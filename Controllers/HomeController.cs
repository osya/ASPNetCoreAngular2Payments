using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNetCoreAngular2Payments.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        [ServiceFilter(typeof(AngularAntiForgeryTokenAttribute), IsReusable = true)]    // Send new antiforgery token
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
