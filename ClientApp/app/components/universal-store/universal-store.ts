import { Injectable } from "@angular/core";

export class StoreBackend {
    getValue(key: string) {
        throw new Error("Error getValue on Backend");
    }

    setValue(key: string, value: any) {
        throw new Error("Error setValue on Backend");
    }
}

@Injectable()
export class Store {
    constructor(public backend: StoreBackend) { }

    get(key) {
        return this.backend.getValue(key);
    }

    set(key, value) {
        return this.backend.setValue(key, value);
    }
}


//import { OpaqueToken } from "@angular/core";
//
//export const opaqueLocalStorage = new OpaqueToken("localStorage");
