import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { StripeTokenHandler } from "../../services";
import { appConfigOpaqueToken, IAppConfig } from "../../app.config";

@Component({
    selector: "sd-stripe-form",
    templateUrl: "stripe-form.component.html"
})
export class StripeFormComponent {
    constructor(private readonly stripeTokenHandler: StripeTokenHandler, @Inject(appConfigOpaqueToken) private readonly config: IAppConfig) { }

    getToken() {
        // create local variable for stripeTokenHandler because in token() `this` is not a classes `this`  
        const stripeTokenHandler = this.stripeTokenHandler;
        const handler = (window as any).StripeCheckout.configure({
            key: this.config.stripePubKey,
            locale: "auto",
            token(token: any) {
                stripeTokenHandler.sendToken(token.id);
            },
            image: "https://stripe.com/img/documentation/checkout/marketplace.png"
        });

        handler.open({
            name: "Demo Site",
            description: "Stripe payment for $5",
            amount: 500
        });
    }
}