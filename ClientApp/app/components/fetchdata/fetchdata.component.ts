import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AuthHttp } from "angular2-jwt";
import { Alert } from "../../services";
import "rxjs/add/operator/finally";

@Component({
    selector: "fetchdata",
    templateUrl: "fetchdata.component.html"
})
export class FetchDataComponent {
    forecasts: IWeatherForecast[];
    loading = true;
    isBrowser: boolean;

    constructor(private readonly authHttp: AuthHttp,
        private readonly alert: Alert,
        @Inject(PLATFORM_ID) private readonly platformId: string) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
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
