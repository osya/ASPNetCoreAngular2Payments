import { Component, OnInit } from "@angular/core";

import { Alert } from "../../services/";

@Component({
    selector: "alert",
    templateUrl: "alert.component.html"
})

export class AlertComponent {
    message: any;

    constructor(private readonly alert: Alert) { }

    ngOnInit() {
        this.alert.getMessage().subscribe(message => { this.message = message ? { type: message.type, text: Array.isArray(message.text) ? message.text : [message.text] } : undefined; });
    }
}