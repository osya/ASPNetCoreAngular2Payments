using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using ASPNetCoreAngular2Payments.SimpleTokenProvider;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace ASPNetCoreAngular2Payments
{
    public partial class Startup
    {
        private void ConfigureAuth(IApplicationBuilder app)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["SecretKey"]));

            var tokenValidationParameters = new TokenValidationParameters
            {
                // The signing key must match!
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,

                // Validate the JWT Issuer (iss) claim
                ValidateIssuer = true,
                ValidIssuer = "ExampleIssuer",

                // Validate the JWT Audience (aud) claim
                ValidateAudience = true,
                ValidAudience = "http://localhost:41225/",

                // Validate the token expiry
                ValidateLifetime = true,

                // If you want to allow a certain amount of clock drift, set that here:
                ClockSkew = TimeSpan.Zero,
            };

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = tokenValidationParameters
            });

            var userManager = app.ApplicationServices.GetService<UserManager<IdentityUser>>();

            app.UseSimpleTokenProvider(new TokenProviderOptions
            {
                Path = "/api/jwt",
                Audience = "http://localhost:41225/",
                Issuer = "ExampleIssuer",
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
                IdentityResolver = (username, password) => GetIdentity(userManager, username, password)
        });
        }

        private static async Task<ClaimsIdentity> GetIdentity(UserManager<IdentityUser> userManager, string email, string password)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return null;
            }
            var result = await userManager.CheckPasswordAsync(user, password);
            return result ? new ClaimsIdentity(new GenericIdentity(email, "Token"), new[] { new Claim("user_name", user.UserName), new Claim("user_id", user.Id) }) : null;
        }
    }
}
