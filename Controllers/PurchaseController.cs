using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ASPNetCoreAngular2Payments.Controllers
{
    public class PurchaseController : Controller
    {
        [HttpPost]
        [AllowAnonymous]
        public JsonResult Charge([FromBody]string tokenId)
        {
            return Json(Ok());
        }
    }
}
