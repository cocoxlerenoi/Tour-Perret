import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'my-marker-dialog',
    styleUrls: ['marker-dialog.component.scss'],
    templateUrl: 'marker-dialog.component.html',
})
export class MarkerDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<MarkerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    saveMarker(): void {
        this.dialogRef.close(true);
    }

    deleteMarker(data): void {
        this.dialogRef.close(false);
    }

}