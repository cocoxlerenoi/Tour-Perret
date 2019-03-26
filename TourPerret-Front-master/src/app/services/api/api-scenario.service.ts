import { Injectable } from '@angular/core';
import { ScenarioService } from '../scenario.service';
import { Scenario } from '../../models/scenario.class';
import { DialogService } from '../dialog.service';
import { ApiService } from './api.service';
import { HttpResponse } from '../../models/http-response.interface';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ApiScenarioService extends ApiService {

    constructor(http: HttpClient, dialogService: DialogService,
                private scenarioService: ScenarioService) {
        super(http, dialogService);
    }

    public getScenario(id: number): Observable<Scenario> {
        return this.http.get<Scenario>(ApiService.BASE_URL + 'scenario/utilisateur/' + id, { headers: this.getHeaders() }).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private getPostArgs(date: Date) {
        return {
            scenario_json: JSON.stringify(this.scenarioService.getScenario().getJsonElec()),
            scenario_json_editeur: JSON.stringify(this.scenarioService.getScenario().getJsonEditeur()),
            elec: JSON.stringify(this.scenarioService.getScenario().generateElec()),
            utilisateur_id: 3,
            date: (date != null ? date.getTime() : null)
        };
    }

    public sendScenario(date: Date = null): Observable<HttpResponse | any> {
        this.scenarioService.generate();

        return this.http.post(ApiService.BASE_URL + 'scenario', this.getPostArgs(date)).pipe(
            catchError(err => this.handleError(err))
        );
    }
}
