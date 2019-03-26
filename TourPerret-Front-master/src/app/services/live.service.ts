import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import * as io from 'socket.io-client';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LiveService {

    public static readonly IP_RASPBERRY = '192.168.0.1';
    public static readonly DEFAULT_IP = 'mini-tourperret';
    public static readonly PORT = '2609';

    public ip: string = LiveService.DEFAULT_IP;

    public enable: boolean = false;
    public useRest: boolean = true;

    private socket: SocketIOClient.Socket = null;

    constructor(private dialogService: DialogService, private http: HttpClient) { }

    public toggle(state: boolean): void {
        if (!this.useRest) {
            if (state) {
                if (this.socket == null || (this.socket && this.socket.disconnected)) {
                    if (this.socket) {
                        this.socket.close();
                        this.socket.removeAllListeners();
                    }

                    if (this.ip === LiveService.DEFAULT_IP) {
                        this.socket = io(LiveService.IP_RASPBERRY + ':' + LiveService.PORT);
                    } else {
                        if (this.ip.indexOf(':') === -1) {
                            this.ip += ':' + LiveService.PORT;
                        }
                        this.socket = io(this.ip);
                    }

                    const self = this;

                    this.socket.on('connect', function () {
                        self.dialogService.toast('Live connecté !');
                        self.enable = true;
                    });

                    this.socket.on('disconnect', function () {
                        self.dialogService.toast('Live déconnecté !');
                        self.enable = false;
                    });

                    this.socket.on('connect_error', function () {
                        self.dialogService.toast('Live erreur de connection');
                        self.socket.disconnect();
                        self.enable = false;
                    });
                }
            } else if (this.socket && this.socket.connected) {
                this.socket.disconnect();
                this.enable = false;
            }
        } else {
            if (this.ip === LiveService.DEFAULT_IP) {
                this.ip = LiveService.IP_RASPBERRY;
            }
            this.enable = state;
        }
    }

    public sendSequenceToServer(sequence: any): void {
        if (!this.useRest) {
            if (this.socket && this.socket.connected) {
                this.socket.emit('live', sequence);
            }
        } else {
            let params: HttpParams = new HttpParams();
            for (let i = 0; i < sequence.length - 1; i++) {
                params = params.set((i + 1) + '', sequence[i]);
            }
            this.http.get('http://' + this.ip + '/color', { params: params }).pipe(
                catchError((err: HttpErrorResponse) => {
                    this.dialogService.toast('Erreur live API : ' + err.message);
                    return of();
                })
            ).subscribe();
        }
    }
}
