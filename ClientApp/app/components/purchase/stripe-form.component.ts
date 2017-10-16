import { Component, Inject } from "@angular/core";
import { StripeTokenHandler } from "../../services";
import { appConfigOpaqueToken } from "../../app.config";
import { IAppConfig } from "../../iapp.config";
import { IStripeChargeModel } from "../../models/stripe.interface"

@Component({
    selector: "sd-stripe-form",
    templateUrl: "stripe-form.component.html"
})
export class StripeFormComponent {
    constructor(private readonly stripeTokenHandler: StripeTokenHandler, @Inject(appConfigOpaqueToken) private readonly config: IAppConfig) { }

    onSubmit() {
        function createHandler(stripeTokenHandler: StripeTokenHandler, config: IAppConfig) {
            return (window as any).StripeCheckout.configure({
                key: config.stripePubKey,
                locale: "auto",
                token(token: any) {
                    const model: IStripeChargeModel = {
                        token: token.id,
                        amount: config.chargeAmount,
                        currency: config.chargeCurrency,
                        description: config.chargeDescription,
                        email: config.chargeEmail
                    };
                    stripeTokenHandler.charge(model).subscribe();
                },
                image: "https://stripe.com/img/documentation/checkout/marketplace.png"
            });
        }
        createHandler(this.stripeTokenHandler, this.config).open({
            amount: this.config.chargeAmount * 100,
            currency: this.config.chargeCurrency,
            description: this.config.chargeDescription,
            email: this.config.chargeEmail,
            name: this.config.chargeName
        });
    }
}