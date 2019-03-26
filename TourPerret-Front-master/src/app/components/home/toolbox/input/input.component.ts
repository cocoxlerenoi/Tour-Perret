import { Component, Input } from '@angular/core';
import { InputNumber } from '../../../../models/modules/inputs/input-number';
import { IInput } from '../../../../models/modules/inputs/input.class';

@Component({
    selector: 'my-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})

export class InputComponent {

    public readonly COLORS: string[] = ['#000', '#00F', '#0F0', '#0FF', '#F00', '#F0F', '#FF0', '#FFF'];

    @Input() inputModel: IInput;
    @Input() inputNumber: number = -1;

    private numbers: number[];

    constructor() { }

    trackByFn(index: any, item: any) {
        return index;
    }

    getNumbers(): number[] {
        if (this.numbers == null) {
            const input: InputNumber = this.inputModel as InputNumber;
            this.numbers = [];

            for (let i = input.min; i <= input.max; i += input.step) {
                this.numbers.push(i);
            }
        }

        return this.numbers;
    }
}
