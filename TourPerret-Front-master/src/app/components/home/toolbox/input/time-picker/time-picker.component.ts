import { Component, Input, OnInit } from '@angular/core';
import { InputNumber } from '../../../../../models/modules/inputs/input-number';
import { Scenario } from '../../../../../models/scenario.class';

@Component({
    selector: 'my-time-picker',
    templateUrl: './time-picker.component.html',
    styleUrls: ['./time-picker.component.scss']
})

export class TimePickerComponent implements OnInit {

    private static NUMBER_SECONDS: number[];

    @Input() input: InputNumber;
    @Input() inputI: number;

    seconds: number;
    milliseconds: number;

    private numberMilliseconds: number[];

    constructor() { }

    ngOnInit(): void {
        this.convertToTime();
    }

    convertToTime(): void {
        this.seconds = Math.floor(this.input.value[this.inputI] / 1000);
        this.milliseconds = this.input.value[this.inputI] % 1000;
    }

    convertToMillis(): void {
        if (this.seconds == 0 && this.milliseconds == 0) {
            this.milliseconds = this.input.min;
        }

        this.input.value[this.inputI] = this.seconds * 1000 + this.milliseconds;
        this.input.checkValue();
        this.convertToTime();
    }

    getNumberSeconds(): number[] {
        if (TimePickerComponent.NUMBER_SECONDS == null) {
            TimePickerComponent.NUMBER_SECONDS = [];

            for (let i = 0; i <= Scenario.MAX_SCENARIO_MINUTES * 60; i++) {
                TimePickerComponent.NUMBER_SECONDS.push(i);
            }
        }

        return TimePickerComponent.NUMBER_SECONDS;
    }

    getNumberMilliseconds(): number[] {
        if (this.numberMilliseconds == null) {
            this.numberMilliseconds = [];

            for (let i = 0; i < 1000; i += 50) {
                this.numberMilliseconds.push(i);
                if (this.milliseconds - i > 0 && this.milliseconds - i < 50) {
                    this.numberMilliseconds.push(this.milliseconds);
                }
            }
        }

        return this.numberMilliseconds;
    }
}
