using System;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ASPNetCoreAngular2Payments
{
    /// <summary>
    /// This attribute adds token in Cookie in Response
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class AngularAntiForgeryTokenAttribute: ActionFilterAttribute
    {
        private const string CookieName = "XSRF-TOKEN";
        private readonly IAntiforgery _antiforgery;

        public AngularAntiForgeryTokenAttribute(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            base.OnResultExecuting(context);

            if (context.Cancel) return;
            var tokens = _antiforgery.GetAndStoreTokens(context.HttpContext);

            context.HttpContext.Response.Cookies.Append(
                CookieName,
                tokens.RequestToken,
                new CookieOptions { HttpOnly = false });
        }
    }
}
