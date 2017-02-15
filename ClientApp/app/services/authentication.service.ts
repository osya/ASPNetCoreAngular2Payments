import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { LocalStorageService } from "angular-2-local-storage";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {
    constructor(private readonly localStorage: LocalStorageService, private readonly http: Http) { }

    login(email: string, password: string) {
        const body = `email=${email}&password=${password}`;
        const options = new RequestOptions({ headers: new Headers({ 'Content-Type': "application/x-www-form-urlencoded" }) });
        return this.http.post("/api/authenticate", body, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const user = response.json();
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("currentUser");
    }

    register(): boolean {
        return false;
    }
}