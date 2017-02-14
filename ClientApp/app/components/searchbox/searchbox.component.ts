import { Component, Input, Output } from "@angular/core";

@Component({
    selector: "search-box",
    template: `<div>
                    <input #box type="text" (keyup.enter)="displayAlert(box.value)" placeholder="lets get searching..." />
               </div>`
})
export class SearchboxComponent {
    displayAlert(msg: string) {
        window.alert(msg);
    }
}