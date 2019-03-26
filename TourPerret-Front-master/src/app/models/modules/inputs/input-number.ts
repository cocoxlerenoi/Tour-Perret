import { Input } from './input.class';

export class InputNumber extends Input<number> {

    constructor(label: string, description: string, descriptionsValues: string[], value: number[],
                global: boolean = false,
                public min: number = 0, public step: number = 1, public max: number = Number.MAX_SAFE_INTEGER,
                public timePicker: boolean = true) {
        super('number', label, description, descriptionsValues, value, global);
    }

    protected checkAndRectifyValue(value: number[]): number[] {
        for (const vI in value) {
            value[vI] = (value[vI] < this.min ? this.min : value[vI]);
            value[vI] = (value[vI] > this.max ? this.max : value[vI]);
        }

        return value;
    }

    public getPercentage(i: number): number {
        if (i < this.value.length) {
            let total: number = 0;

            for (const val of this.value) {
                total += val;
            }

            return this.value[i] / total * 100;
        } else {
            return 0;
        }
    }
}
