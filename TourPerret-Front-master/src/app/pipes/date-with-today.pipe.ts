import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateWithToday'
})

export class DateWithTodayPipe implements PipeTransform {

    transform(value: any) {
        const date: Date = new Date(value);
        const now: Date = new Date();

        if (date.getDate() == now.getDate()) {
            return 'aujourd\'hui à ' + date.toLocaleTimeString('fr-FR');
        } else {
            return 'le ' + date.toLocaleDateString('fr-FR');
        }
    }
}
