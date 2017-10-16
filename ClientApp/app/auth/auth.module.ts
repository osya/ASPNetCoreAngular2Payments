import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomFormsModule } from "ng2-validation";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CustomFormsModule,
        RouterModule.forChild([
            { path: "login", component: LoginComponent },
            { path: "register", component: RegisterComponent }
        ])
    ]
})
export class AuthModule { }