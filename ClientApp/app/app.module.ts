import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UniversalModule } from "angular2-universal";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage";
//import { Store } from "./components/universal-store/universal-store";
import { FormsModule } from "@angular/forms";

import { AlertComponent } from "./components/alert/alert.component";
import { AppComponent } from "./components/app/app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./components/home/home.component";
import { FetchDataComponent } from "./components/fetchdata/fetchdata.component";
import { CounterComponent } from "./components/counter/counter.component";
import { SearchboxComponent } from "./components/searchbox/searchbox.component";
import { StripeFormComponent } from "./components/purchase/stripe-form.component";
import { StripeCustomFormComponent } from "./components/purchase/stripe-custom-form.component";

import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/auth.guard";
import { Http, RequestOptions } from "@angular/http";
import { AuthHttp, AuthConfig } from "angular2-jwt";
import { Auth } from "./auth/services/";
import { Alert, StripeTokenHandler } from "./services/";

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AlertComponent,
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        SearchboxComponent,
        StripeFormComponent,
        StripeCustomFormComponent
//        Store
    ],
    imports: [
        UniversalModule, // must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        LocalStorageModule.withConfig({
            prefix: "app",
            storageType: "localStorage"
        }),
        RouterModule.forRoot([
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
            { path: "counter", component: CounterComponent },
            { path: "fetch-data", component: FetchDataComponent },
            { path: "search", component: SearchboxComponent },
            { path: "stripe-default-purchase", component: StripeFormComponent },
            { path: "stripe-custom-purchase", component: StripeCustomFormComponent },
            { path: "**", redirectTo: "home" }
        ]),
        FormsModule,
        AuthModule
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: (http: Http, options: RequestOptions, localStorageService: LocalStorageService) => {
                return new AuthHttp(new AuthConfig({
                    tokenName: "id_token",
                    tokenGetter: (() => localStorageService.get<string>("id_token")),
                    globalHeaders: [{ 'Content-Type': "application/json" }],
                    noJwtError: true
                }), http, options);
            },
            deps: [Http, RequestOptions, LocalStorageService]
        },
        Alert,
        StripeTokenHandler,
        Auth,
        AuthGuard,
        LocalStorageService
    ]
})
export class AppModule {
}
