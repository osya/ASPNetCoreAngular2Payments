using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNetCoreAngular2Payments.Models
{
    public class StripeChargeModel
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public double Amount { get; set; }

        public string Currency { get; set; } = "EUR";

        public string Description { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }
}
