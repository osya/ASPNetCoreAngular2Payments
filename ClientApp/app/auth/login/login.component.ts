import { isPlatformBrowser } from "@angular/common";
import { Inject, PLATFORM_ID, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { IUser } from "../../models/user.interface";
import { Auth } from ".."
import { Alert } from "../../services";

@Component({
    selector: "login",
    templateUrl: "login.component.html"
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
        @Inject(PLATFORM_ID) private readonly platformId: string
    ) {}

    ngOnInit() {
        this.user = {
            email: "",
            password: "",
            confirmPassword: ""
        }
        if (isPlatformBrowser(this.platformId)) {
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