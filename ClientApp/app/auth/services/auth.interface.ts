import { IUser } from "../../models/user.interface";

export interface IAuthService {
//    TODO: Уточнить возвращаемые типы
    signUp(user: IUser): any;
    login(user: IUser): any;
    logout(): any;
    isLoggedIn(): any;
    isLoggedInWithFacebook(): any;
}