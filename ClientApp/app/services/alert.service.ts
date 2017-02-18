import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable } from "rxjs";
import { Subject } from "rxjs/Subject";

@Injectable()
export class Alert {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private readonly router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: "success", text: message });
    }

    error(error: string | Response, keepAfterNavigationChange = false)
    {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        if (typeof (error) === "object") {
            const errList: string[] = [];
            const pDict = error.json();
            for (let key in pDict) {
                if (pDict.hasOwnProperty(key)) {
                    const errDict = pDict[key];
                    for (let errKey in errDict) {
                        if (errDict.hasOwnProperty(errKey)) {
                            errList.push(errDict[errKey]);
                        }
                    }
                }
            }
            this.subject.next({ type: "error", text: errList });
        } else {
            const message = error;
            this.subject.next({ type: "error", text: message });
        }
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}