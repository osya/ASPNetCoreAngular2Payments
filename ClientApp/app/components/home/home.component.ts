import { Component } from "@angular/core";
import { LocalStorageService } from "angular-2-local-storage";
import { isBrowser, isNode } from "angular2-universal";
import { JwtHelper } from "angular2-jwt";
import { IUser } from "../../models/user.interface";
import { Auth } from "../../auth/services/";

@Component({
    selector: "home",
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    currentUser: IUser;
    private readonly jwtHelper: JwtHelper;
    
    constructor(private readonly localStorageService: LocalStorageService, private readonly auth: Auth) {
        this.jwtHelper = new JwtHelper();
        if (isBrowser) {
            const decodedToken = this.jwtHelper.decodeToken(localStorageService.get<string>("id_token"));
            this.currentUser = {
                email: decodedToken.sub,
                password: "",
                confirmPassword: ""
            }
        }
    }
}