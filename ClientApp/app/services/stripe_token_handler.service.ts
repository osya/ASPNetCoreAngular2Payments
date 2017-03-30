import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { IStripeChargeModel } from "../models/stripe.interface"

@Injectable()
export class StripeTokenHandler {
    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/json" }) });

    constructor(private readonly http: Http) { }

    charge(model: IStripeChargeModel) {
        // Charge on your server
        return this.http.post("/Purchase/StripeCharge", JSON.stringify(model), this.options).map(res => res.json());
    }
}