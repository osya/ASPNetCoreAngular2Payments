import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { LocalStorageService } from "angular-2-local-storage";
import { isBrowser, isNode } from "angular2-universal";
import { tokenNotExpired } from "angular2-jwt";
import "rxjs/add/operator/map";
import { IUser } from "../../models/user.interface";
import { IAuthService } from "./auth.interface"

@Injectable()
export class Auth implements IAuthService {
    constructor(private readonly localStorageService: LocalStorageService, private readonly http: Http) { }

    signUp(user: IUser) {
        if (isBrowser) {
            return this.http.post("/api/users", user);
        } else {
            throw new Error("Signup event cannot be called while doing server side rendering");
        }
    }

    login(user: IUser) {
        if (isBrowser) {
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
        } else if (isNode) {
            throw new Error("Login event cannot be called while doing server side rendering");
        }
        throw new Error("Login event can be called only during client-side rendering");
    }

    // reset login status
    logout() {
        if (isBrowser) {
            // remove user from local storage to log user out
            this.localStorageService.remove("id_token");
        } else if (isNode) {
            throw new Error("Logout event cannot be called while doing server side rendering");
        }
    }

    isLoggedIn() {
        return (isBrowser && tokenNotExpired(this.localStorageService.deriveKey("id_token")));
    }

    isLoggedInWithFacebook() {}
}