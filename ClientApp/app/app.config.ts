import { OpaqueToken } from "@angular/core";

export let appConfigOpaqueToken = new OpaqueToken("app.config");

export interface IAppConfig {
    stripePubKey: string;
}

export const appConfig: IAppConfig = {
    stripePubKey: "pk_test_yb1bFTfcnqHR3riVNGmeiO9G"
};