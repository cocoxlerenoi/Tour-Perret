import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mapToIterable'})
export class MapToIterablePipe implements PipeTransform {

    transform(value): any {
        const a: any = [];

        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                let keyOk = null;
                if (Number(key)) {
                    keyOk = Number(key);
                } else {
                    keyOk = key;
                }
                a.push({key: keyOk, val: value[key]});
            }
        }
        return a;
    }
}
