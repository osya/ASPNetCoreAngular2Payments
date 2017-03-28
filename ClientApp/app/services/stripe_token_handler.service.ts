import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";

@Injectable()
export class StripeTokenHandler {
    constructor(private readonly http: Http) { }

    sendToken(tokenId: string) {
        // Send the token to your server

        const options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/json" }) });
        this.http.post("/Purchase/Charge", JSON.stringify(tokenId), options).subscribe();
    }
}