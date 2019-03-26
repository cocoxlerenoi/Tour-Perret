import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'secondsToTime'})
export class SecondsToTimePipe implements PipeTransform {

    transform(msInput) {
        const ms = msInput % 1000;
        msInput = (msInput - ms) / 1000;
        const secs = msInput % 60;
        msInput = (msInput - secs) / 60;
        const mins = msInput % 60;

        let str: string = '';

        if (mins > 0) {
            str += '' + mins + ' min';

            if (secs > 0 || ms > 0) {
                str += ' ';
            }
        }

        if (secs > 0) {
            if (secs < 10 && mins > 0) {
                str += '0';
            }
            str += '' + secs + 's';

            if (ms > 0) {
                str += ' et ';
            }
        }

        if (ms > 0) {
            if (ms < 10) {
                str += '0';
            }
            str += '' + ms + 'ms';
        }

        if (mins == 0 && secs == 0 && ms == 0) {
            str = '0ms';
        }

        return str;
    }
}
