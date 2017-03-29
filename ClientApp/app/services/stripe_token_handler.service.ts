import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { IStripeChargeModel } from "../models/stripe.interface"

@Injectable()
export class StripeTokenHandler {
    constructor(private readonly http: Http) { }

    charge(model: IStripeChargeModel) {
        // Charge on your server
        const options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/json" }) });
        return this.http.post("/Purchase/Charge", JSON.stringify(model), options).map(res => res.json());
    }
}