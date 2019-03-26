import { DialogService } from '../dialog.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

export abstract class ApiService {

    public static readonly BASE_URL = 'http://tour-perret.fr/api/';

    constructor(protected http: HttpClient, private dialogService: DialogService) {}

    protected getHeaders(): HttpHeaders {
        const username: string = 'curious';
        const password: string = 'perret';
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));

        return headers;
    }

    protected handleError(error: Response | any, message: string = 'Problème réseau') {
        this.dialogService.toast('Erreur pour contacter le serveur');

        console.error(error);

        return throwError(error);
    }
}
