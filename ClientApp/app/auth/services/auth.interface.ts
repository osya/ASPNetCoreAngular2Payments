import { IUser } from "../../models/user.interface";

export interface IAuthService {
    signUp(user: IUser);
    login(user: IUser);
    logout();
    isLoggedIn();
    isLoggedInWithFacebook();
}