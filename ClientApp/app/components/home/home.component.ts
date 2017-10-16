import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { LocalStorageService } from "angular-2-local-storage";
import { JwtHelper } from "angular2-jwt";
import { IUser } from "../../models/user.interface";
import { Auth } from "../../auth/services/";

@Component({
    selector: "home",
    templateUrl: "home.component.html"
})
export class HomeComponent {
    currentUser: IUser;
    private readonly jwtHelper: JwtHelper;

    
    constructor(private readonly localStorageService: LocalStorageService, public readonly auth: Auth, @Inject(PLATFORM_ID) private readonly platformId: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.jwtHelper = new JwtHelper();
        const idToken = localStorageService.get<string>("id_token");
        if (!idToken) {
            return;
        }
        const decodedToken = this.jwtHelper.decodeToken(idToken);
        this.currentUser = {
            email: decodedToken.sub,
            password: "",
            confirmPassword: ""
        }
    }
}