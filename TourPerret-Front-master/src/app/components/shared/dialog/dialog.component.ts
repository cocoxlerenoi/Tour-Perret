import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'my-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss'],
})
export class DialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    close() {
        if (this.data.toggleLabel) {
            this.dialogRef.close({
                input: this.data.inputModel,
                toggle: this.data.toggleModel
            });
        } else {
            this.dialogRef.close(this.data.inputModel);
        }
    }
}
