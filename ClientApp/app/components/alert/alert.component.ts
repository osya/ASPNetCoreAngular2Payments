import { Component, OnInit } from "@angular/core";
import { Response } from "@angular/http";

import { AlertService } from "../../services/";

@Component({
    selector: "alert",
    templateUrl: "alert.component.html"
})

export class AlertComponent {
    message: any;

    constructor(private readonly alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message ? { type: message.type, text: Array.isArray(message.text) ? message.text : [message.text] } : undefined; });
    }
}