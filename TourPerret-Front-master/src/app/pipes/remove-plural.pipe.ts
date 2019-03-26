import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'removePlural'})
export class RemovePluralPipe implements PipeTransform {

    transform(value) {
        if (value.length >= 2 &&
            (value.charAt(value.length - 1) == 's' || value.charAt(value.length - 1) == 'x')) {
            value = value.slice(0, -1);
        }

        return value;
    }
}
