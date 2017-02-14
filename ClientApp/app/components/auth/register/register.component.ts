import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { IUser } from "../../../models/user.interface";
import { AlertService, UserService } from "../../../services/";

@Component({
    selector: "register",
    template: require("./register.component.html")
})
export class RegisterComponent implements OnInit {
    user: IUser;
    loading = false;

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly alertService: AlertService
    ) { }

    ngOnInit() {
        this.user = {
            email: "",
            password: "",
            confirmPassword: ""
        }
    }

    register() {
        this.loading = true;
        this.userService.create(this.user)
            .subscribe(
            () => {
                // set success message and pass true paramater to persist the message after redirecting to the login page
                this.alertService.success("Registration successful", true);
                this.router.navigate(["/login"]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}