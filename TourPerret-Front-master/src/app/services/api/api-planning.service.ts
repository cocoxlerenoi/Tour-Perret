import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { HttpResponse } from '../../models/http-response.interface';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ApiPlanningService extends ApiService {

    constructor(http: HttpClient, dialogService: DialogService) {
        super(http, dialogService);
    }

    public getPlanningPeriods(date: Date): Observable<HttpResponse> {
        return this.http.get<HttpResponse>(ApiService.BASE_URL + 'planning-periodes/' + (date.getTime() / 1000), { headers: this.getHeaders() }).pipe(
            catchError(err => this.handleError(err))
        );
    }
}
