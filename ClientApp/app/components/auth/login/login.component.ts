import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { IUser } from "../../../models/user.interface";
import { AlertService, AuthenticationService } from "../../../services";

@Component({
    selector: "login",
    template: require("./login.component.html")
})
export class LoginComponent implements OnInit {
    user: IUser;
    loading = false;
    returnUrl: string;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.user = {
            email: "",
            password: "",
            confirmPassword: ""
        }

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.user.email, this.user.password)
            .subscribe(
            () => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}