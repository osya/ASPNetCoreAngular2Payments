import { Component, OnInit } from "@angular/core";
import { isBrowser, isNode } from "angular2-universal";
import { StripeTokenHandler } from "../../services";

@Component({
    selector: "sd-custom-form",
    templateUrl: "stripe-custom-form.component.html",
    styleUrls: ["./stripe-custom-form.component.css"]
})
export class StripeCustomFormComponent implements OnInit {
    message: string;
    private stripe: any;
    private card: any;

    constructor(private readonly stripeTokenHandler: StripeTokenHandler) { }

    ngOnInit(): void {
        if (isBrowser) {
            this.stripe = (window as any).Stripe("pk_test_yb1bFTfcnqHR3riVNGmeiO9G");
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

            this.card.addEventListener("change", event => {
                if (event.error) {
                    this.message = event.error.message;
                } else {
                    this.message = "";
                }
            });
        }
    }

    getToken() {
        this.message = "Loading...";
        event.preventDefault();

        this.stripe.createToken(this.card).then(result => {
            if (result.error) {
                // Inform the user if there was an error
                this.message = result.error.message;
            } else {
                this.message = "";
                this.stripeTokenHandler.sendToken(result.token.id);
            }
        });
    }
}