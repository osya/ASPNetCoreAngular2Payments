import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "sd-stripe-form",
    templateUrl: "stripe-form.component.html",
})
export class StripeFormComponent {
    openCheckout() {
        var handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_yb1bFTfcnqHR3riVNGmeiO9G',
            locale: 'auto',
            token: function (token: any) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                console.log(token.id);
            },
            image: "https://stripe.com/img/documentation/checkout/marketplace.png"
        });

        handler.open({
            name: 'Demo Site',
            description: 'Stripe payment for $5',
            amount: 500
        });
    }
}