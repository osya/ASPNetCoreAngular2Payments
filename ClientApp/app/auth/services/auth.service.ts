import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { LocalStorageService } from "angular-2-local-storage";
import { tokenNotExpired } from "angular2-jwt";
import "rxjs/add/operator/map";
import { IUser } from "../../models/user.interface";
import { IAuthService } from "./auth.interface"

@Injectable()
export class Auth implements IAuthService {
    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly http: Http,
        @Inject(PLATFORM_ID) private readonly platformId: string
    ) {}

    signUp(user: IUser) {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.post("/api/users", user);
        } else {
            throw new Error("Signup event cannot be called while doing server side rendering");
        }
    }

    login(user: IUser) {
        if (isPlatformBrowser(this.platformId)) {
            const body = `email=${user.email}&password=${user.password}`;
            const options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/x-www-form-urlencoded" }) });
            return this.http.post("/api/jwt", body, options)
                .map((response: Response) => {
                    // login successful if there's a jwt token in the response
                    const responseJson = response.json();
                    if (response && responseJson.access_token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        this.localStorageService.set("id_token", responseJson.access_token);
                    }
                });
        }
        throw new Error("Login event can be called only during client-side rendering");
    }

    // reset login status
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            // remove user from local storage to log user out
            this.localStorageService.remove("id_token");
        } else {
            throw new Error("Logout event cannot be called while doing server side rendering");
        }
    }

    isLoggedIn() {
        return (isPlatformBrowser(this.platformId) && tokenNotExpired(this.localStorageService.deriveKey("id_token")));
    }

    isLoggedInWithFacebook() {}
}