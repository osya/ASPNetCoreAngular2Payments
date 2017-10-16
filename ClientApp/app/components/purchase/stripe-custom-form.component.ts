import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { StripeTokenHandler } from "../../services";
import { appConfigOpaqueToken } from "../../app.config";
import { IAppConfig } from "../../iapp.config";
import { IStripeChargeModel } from "../../models/stripe.interface";

@Component({
    selector: "sd-custom-form",
    templateUrl: "stripe-custom-form.component.html",
    styleUrls: ["./stripe-custom-form.component.css"]
})
export class StripeCustomFormComponent implements OnInit {
    message: string;
    private stripe: any;
    private card: any;

    constructor(
        private readonly stripeTokenHandler: StripeTokenHandler,
        @Inject(appConfigOpaqueToken) private readonly config: IAppConfig,
        @Inject(PLATFORM_ID) private readonly platformId: string
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.stripe = (window as any).Stripe(this.config.stripePubKey);
            const elements = this.stripe.elements();

            const style = {
                base: {
                    color: "#32325d",
                    lineHeight: "24px",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    '::placeholder': {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a"
                }
            };

            // Create an instance of the card Element
            this.card = elements.create("card", { style: style, hidePostalCode: true });

            // Add an instance of the card Element into the `card-element` <div>
            this.card.mount("#card-element");

            this.card.addEventListener("change", (event: any) => {
                if (event.error) {
                    this.message = event.error.message;
                } else {
                    this.message = "";
                }
            });
        }
    }

    onSubmit(event: any) {
        this.message = "Loading...";
        event.preventDefault();

        this.stripe.createToken(this.card).then((result: any) => {
            if (result.error) {
                // Inform the user if there was an error
                this.message = result.error.message;
            } else {
                this.message = `Success! Card token ${result.token.id}`;
                const model: IStripeChargeModel = {
                    token: result.token.id,
                    amount: this.config.chargeAmount,
                    currency: this.config.chargeCurrency,
                    description: this.config.chargeDescription,
                    email: this.config.chargeEmail
                };
                this.stripeTokenHandler.charge(model)
                    .subscribe((data) => { this.message = `ChargeId=${data.value}`; });
            }
        });
    }
}