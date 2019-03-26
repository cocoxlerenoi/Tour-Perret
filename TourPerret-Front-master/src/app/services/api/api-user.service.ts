import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { HttpResponse } from '../../models/http-response.interface';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ApiUserService extends ApiService {

    constructor(http: HttpClient, dialogService: DialogService) {
        super(http, dialogService);
    }

    private crypt(str: string): string {
        return str;
    }

    public connection(email: string, password: string): Observable<HttpResponse> {
        return this.http.get<HttpResponse>(ApiService.BASE_URL + 'utilisateur/', { headers: this.getHeaders() }).pipe(
            catchError(err => this.handleError(err))
        );
    }
}
