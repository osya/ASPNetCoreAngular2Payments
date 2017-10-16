using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using ASPNetCoreAngular2Payments.SimpleTokenProvider;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace ASPNetCoreAngular2Payments
{
    public partial class Startup
    {
		private IApplicationBuilder _app;
        private void ConfigureAuth(IApplicationBuilder app)
        {
            _app = app;
	
            app.UseSimpleTokenProvider(new TokenProviderOptions
            {
                Path = "/api/jwt",
                Audience = Configuration["AppConfiguration:SiteUrl"],
                Issuer = Configuration["AppConfiguration:SiteUrl"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"])), 
                    SecurityAlgorithms.HmacSha256),
                IdentityResolver = GetIdentity
        });
        }

        private async Task<ClaimsIdentity> GetIdentity(string email, string password)
        {
            using (var serviceScope = _app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var userManager = serviceScope.ServiceProvider.GetService<UserManager<IdentityUser>>();
                var user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return null;
                }
                var result = await userManager.CheckPasswordAsync(user, password);
                return result ? new ClaimsIdentity(
                    new GenericIdentity(email, "Token"),
                    new[]
                    {
                        new Claim("user_name", user.UserName), new Claim("user_id", user.Id)
                    }) : null;
            }
        }
    }
}
