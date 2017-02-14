import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { LocalStorageService } from "angular-2-local-storage";

import { IUser } from "../models/user.interface";

@Injectable()
export class UserService {
    constructor(private readonly localStorage: LocalStorageService, private readonly http: Http) { }

    create(user: IUser) {
        return this.http.post("/api/users", user, this.jwt());
    }

//    update(user: User) {
//        return this.http.put(`/api/users/${user.id}`, user, this.jwt()).map((response: Response) => response.json());
//    }

    // private helper methods

    private jwt() {
    // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.token) {
            const headers = new Headers({ 'Authorization': `Bearer ${currentUser.token}` });
            return new RequestOptions({ headers: headers });
        }
    }
}