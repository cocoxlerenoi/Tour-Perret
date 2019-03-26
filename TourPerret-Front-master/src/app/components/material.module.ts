import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule
} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatInputModule,
        MatDialogModule,
        MatMenuModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTabsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatGridListModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatInputModule,
        MatDialogModule,
        MatMenuModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTabsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatGridListModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ],
})
export class MaterialModule {
    static forRoot() {
        return {
            ngModule: MaterialModule,
            providers: [],
        };
    }
}
