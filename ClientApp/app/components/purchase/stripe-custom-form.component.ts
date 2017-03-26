import { Component, OnInit } from "@angular/core";
import { isBrowser, isNode } from "angular2-universal";

@Component({
    selector: "sd-custom-form",
    templateUrl: "stripe-custom-form.component.html",
    styleUrls: ["./stripe-custom-form.component.css"]
})
export class StripeCustomFormComponent implements OnInit {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;

    message: string;

    ngOnInit(): void {
        if (isBrowser) {
            const stripe = (window as any).Stripe("pk_test_yb1bFTfcnqHR3riVNGmeiO9G");
            const elements = stripe.elements();

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
            const card = elements.create("card", { style: style });

            // Add an instance of the card Element into the `card-element` <div>
            card.mount("#card-element");

            card.addEventListener("change", event => {
                const displayError = document.getElementById("card-errors");
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = "";
                }
            });
        }
    }

    getToken() {
//        this.message = "Loading...";

//        const card = elements.create("card");


//        stripe.createToken({
//            number: this.cardNumber,
//            exp_month: this.expiryMonth,
//            exp_year: this.expiryYear,
//            cvc: this.cvc
//        }, (status: number, response: any) => {
//            if (status === 200) {
//                this.message = `Success! Card token ${response.card.id}.`;
//            } else {
//                this.message = response.error.message;
//            }
//        });
    }
}