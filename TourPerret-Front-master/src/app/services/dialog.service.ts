import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarDismiss, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { Observable } from 'rxjs';

@Injectable()
export class DialogService {

    public dialogOpened: boolean = false;
    public dialogRef: MatDialogRef<DialogComponent>;

    constructor(public dialog: MatDialog, public snackBar: MatSnackBar) { }

    public alert(title: string, content: string): Observable<any> {
        if (!this.dialogOpened) {
            this.dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    title: title,
                    content: content,
                    action: false,
                    inputModel: true,
                }
            });
            this.dialogOpened = true;

            this.dialogRef.afterClosed().subscribe(() => this.dialogOpened = false);

            return this.dialogRef.afterClosed();
        } else {
            this.dialogRef.close();
        }
    }

    public confirm(title: string, content: string, cancel: string = 'Non', ok: string = 'Oui'): Observable<any> {
        if (!this.dialogOpened) {
            this.dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    title: title,
                    content: content,
                    action: true,
                    inputModel: true,
                    cancel: cancel,
                    ok: ok,
                }
            });
            this.dialogOpened = true;

            this.dialogRef.afterClosed().subscribe(() => this.dialogOpened = false);

            return this.dialogRef.afterClosed();
        } else {
            this.dialogRef.close();
        }
    }

    public prompt(title: string, content: string, cancel: string = 'Annuler', ok: string = 'Ok', inputLabel: string, inputModel: any): Observable<any> {
        if (!this.dialogOpened) {
            this.dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    title: title,
                    content: content,
                    action: true,
                    input: inputLabel,
                    inputModel: inputModel,
                    cancel: cancel,
                    ok: ok
                }
            });
            this.dialogOpened = true;

            this.dialogRef.afterClosed().subscribe(() => this.dialogOpened = false);

            return this.dialogRef.afterClosed();
        } else {
            this.dialogRef.close();
        }
    }

    public promptPlusToggle(title: string, content: string, cancel: string = 'Annuler', ok: string = 'Ok',
                  inputLabel: string, inputModel: any,
                  toggleLabel: string = null, toggleModel: any = null): Observable<any> {
        if (!this.dialogOpened) {
            this.dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    title: title,
                    content: content,
                    action: true,
                    input: inputLabel,
                    inputModel: inputModel,
                    cancel: cancel,
                    ok: ok,
                    toggleLabel: toggleLabel,
                    toggleModel: toggleModel
                },
                height: '280px'
            });
            this.dialogOpened = true;

            this.dialogRef.afterClosed().subscribe(() => this.dialogOpened = false);

            return this.dialogRef.afterClosed();
        } else {
            this.dialogRef.close();
        }
    }

    public toast(message: string, duration: number = 2000, action: string = null): Observable<MatSnackBarDismiss | void> {
        const snackBar: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(message, action, {
            duration: duration,
        });

        if (action) {
        } else {
            return snackBar.afterDismissed();
        }
    }

    public closeEnterKey(): void {
        if (this.dialogOpened) {
            this.dialogRef.close(this.dialogRef.componentInstance.data.inputModel);
        }
    }
}
