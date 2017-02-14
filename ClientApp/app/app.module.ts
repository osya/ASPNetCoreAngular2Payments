import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UniversalModule } from "angular2-universal";
import { LocalStorageModule } from "angular-2-local-storage";
import { FormsModule } from "@angular/forms";

import { AlertComponent } from "./components/alert/alert.component";
import { AppComponent } from "./components/app/app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./components/home/home.component";
import { FetchDataComponent } from "./components/fetchdata/fetchdata.component";
import { CounterComponent } from "./components/counter/counter.component";
import { SearchboxComponent } from "./components/searchbox/searchbox.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { CustomFormsModule } from "ng2-validation"

import { AuthenticationService, UserService, AlertService } from "./services/";

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
        // TODO: Join LoginComponent & RegisterComponent into one AuthComponent
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        UniversalModule, // must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        LocalStorageModule.withConfig({
            prefix: "app",
            storageType: "localStorage"
        }),
        RouterModule.forRoot([
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: HomeComponent },
            { path: "counter", component: CounterComponent },
            { path: "fetch-data", component: FetchDataComponent },
            { path: "search", component: SearchboxComponent },
            { path: "login", component: LoginComponent },
            { path: "register", component: RegisterComponent },
            { path: "**", redirectTo: "home" }
        ]),
        FormsModule,
        CustomFormsModule
    ],
    providers: [
        AuthenticationService,
        UserService,
        AlertService
    ]
})
export class AppModule {
}
