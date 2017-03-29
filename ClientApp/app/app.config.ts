import { OpaqueToken } from "@angular/core";

export let appConfigOpaqueToken = new OpaqueToken("app.config");

export interface IAppConfig {
    stripePubKey: string;
    chargeAmount: number;
    chargeCurrency: string;
    chargeDescription: string;
    chargeEmail: string;
    chargeName: string;
}

export const appConfig: IAppConfig = {
    stripePubKey: "pk_test_yb1bFTfcnqHR3riVNGmeiO9G",
    chargeAmount: 5,
    chargeCurrency: "EUR",
    chargeDescription: `Stripe test payment for 5€`, // String interpolation `${this.chargeAmount}€` is not working here
    chargeEmail: "test2@gmail.com",
    chargeName: "Demo Site"
};