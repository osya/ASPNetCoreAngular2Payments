import { Component } from "@angular/core";
import { LocalStorageService } from "angular-2-local-storage";
import { IUser } from "../../models/user.interface";
import { UserService } from "../../services/user.service";

@Component({
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    currentUser: IUser;

    constructor(private readonly localStorage: LocalStorageService, private readonly userService: UserService) {
        this.currentUser = JSON.parse(localStorage.get<string>("currentUser"));
    }
}