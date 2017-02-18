import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { isBrowser, isNode } from "angular2-universal";

import { IUser } from "../../models/user.interface";
import { Auth } from ".."
import { Alert } from "../../services";

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
        private readonly auth: Auth,
        private readonly alert: Alert,
    ) { }

    ngOnInit() {
        this.user = {
            email: "",
            password: "",
            confirmPassword: ""
        }
        if (isBrowser) {
            this.auth.logout();
        }

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    }

    login() {
        this.loading = true;
        this.auth.login(this.user)
            .subscribe(
            () => {
                this.router.navigate([this.returnUrl]);
            },
            err => {
                this.alert.error(err.text());
                this.loading = false;
            });
    }
}