import { NgModule } from '@angular/core';

import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { MapToIterablePipe } from './mapToIterable.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { DateWithTodayPipe } from './date-with-today.pipe';
import { RemovePluralPipe } from './remove-plural.pipe';

@NgModule({
    imports:        [],
    declarations:   [
        SecondsToTimePipe,
        MapToIterablePipe,
        CapitalizePipe,
        DateWithTodayPipe,
        RemovePluralPipe,
    ],
    exports:        [
        SecondsToTimePipe,
        MapToIterablePipe,
        CapitalizePipe,
        DateWithTodayPipe,
        RemovePluralPipe,
    ],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
