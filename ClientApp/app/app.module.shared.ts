import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage";
import { AuthModule } from "./auth/auth.module";

import { AppComponent } from "./components/app/app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { FetchDataComponent } from "./components/fetchdata/fetchdata.component";
import { CounterComponent } from "./components/counter/counter.component";
import { AlertComponent } from "./components/alert/alert.component";
import { SearchboxComponent } from "./components/searchbox/searchbox.component";
import { HomeComponent } from "./components/home/home.component";
import { StripeFormComponent, StripeCustomFormComponent, BraintreeComponent } from "./components/purchase/";
import { appConfigOpaqueToken, appConfig } from "./app.config";

import { AuthHttp, AuthConfig } from "angular2-jwt";
import { Http, RequestOptions } from "@angular/http";
import { Auth } from "./auth/services/";
import { Alert, StripeTokenHandler } from "./services/";
import { AuthGuard } from "./auth/auth.guard";

export function authHttpFactory(http: Http, options: RequestOptions, localStorageService: LocalStorageService) {
    return new AuthHttp(new AuthConfig({
        tokenName: "id_token",
        tokenGetter: (() => localStorageService.get<string>("id_token")),
        globalHeaders: [{ 'Content-Type': "application/json" }],
        noJwtError: true
    }), http, options);
}

@NgModule({
    declarations: [
        AlertComponent,
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        SearchboxComponent,
        HomeComponent,
        StripeFormComponent,
        StripeCustomFormComponent,
        BraintreeComponent
    ],
    imports: [
        AuthModule,
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: "", component: HomeComponent, pathMatch: "full", canActivate: [AuthGuard] },
            { path: "counter", component: CounterComponent },
            { path: "fetch-data", component: FetchDataComponent },
            { path: "search", component: SearchboxComponent },
            { path: "stripe-default-purchase", component: StripeFormComponent },
            { path: "stripe-custom-purchase", component: StripeCustomFormComponent },
            { path: "braintree", component: BraintreeComponent },
            { path: "**", redirectTo: "" }
        ]),
        LocalStorageModule.withConfig({
            prefix: "app",
            storageType: "localStorage"
        })
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpFactory,
            deps: [Http, RequestOptions, LocalStorageService]
        },
        Alert,
        Auth,
        AuthGuard,
        LocalStorageService,
        StripeTokenHandler,
        { provide: appConfigOpaqueToken, useValue: appConfig }
    ]
})
export class AppModuleShared {
}