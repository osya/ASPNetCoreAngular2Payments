import { Component } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Alert } from "../../services";
import "rxjs/add/operator/finally";

@Component({
    selector: "fetchdata",
    templateUrl: "./fetchdata.component.html",
})
export class FetchDataComponent {
    forecasts: IWeatherForecast[];
    loading = true;

    constructor(private readonly authHttp: AuthHttp, private readonly alert: Alert) {}

    ngOnInit() {
        this.authHttp.get("/api/SampleData/WeatherForecasts")
            .finally(() => this.loading = false )
            .subscribe(
            result => this.forecasts = result.json() as IWeatherForecast[],
            err => this.alert.error(err.toString())
        );
    }
}

interface IWeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
