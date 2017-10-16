import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { appConfigOpaqueToken } from "../../app.config";
import { IAppConfig } from "../../iapp.config";
//var client = require("braintree-web/client");
//var hostedFields = require("braintree-web/hosted-fields");

@Component({
    selector: "braintree-form",
    templateUrl: "braintree.component.html"
})
export class BraintreeComponent implements OnInit {
    message: string;
    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/json" }) });

    constructor(
        private readonly http: Http,
        @Inject(appConfigOpaqueToken) private readonly config: IAppConfig,
        @Inject(PLATFORM_ID) private readonly platformId: string
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            (window as any).braintree.setup(this.config.braintreeToken,
                "dropin",
                {
                    container: "payment-form"
                });
        }

//        client.create({
//            authorization: 'CLIENT_AUTHORIZATION'
//        }, function (err, clientInstance) {
//            hostedFields.create(/* ... */);
//        });
    }

    onSubmit(event: any) {
        this.message = "Loading...";
        event.preventDefault();

        this.http.post("/Purchase/BraintreeCharge", JSON.stringify(this.config.braintreeNonce), this.options)
            .map(res => res.json())
            .subscribe((data) => { this.message = `${data.value}`; });
    }
}