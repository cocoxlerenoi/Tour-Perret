import { Utils } from '../../../services/utils.class';

export interface IInput {
    nom: string;
    description: string;
    descriptionsValues: string[];
    value: any[];
    global: boolean;
    type: string;
}

export class Input<T> implements IInput{

    constructor(public type: string,
                public nom: string,
                public description: string,
                public descriptionsValues: string[],
                public value: T[],
                public global: boolean) {
    }

    public setValue(value: T[]): void {
        this.value = Utils.clone(this.checkAndRectifyValue(value), false);
    }

    protected checkAndRectifyValue(value: T[]): T[] {
        return value;
    }

    public checkValue(): void {
        this.setValue(this.value);
    }

    public getFirst(): T {
        return this.value[0];
    }

    public isSwitchable(): boolean {
        return this.value.length > 1;
    }

    public switch(): void {
        if (this.value[0] instanceof Object) {
            const tmp = Utils.clone(this.value[0], false);
            this.value[0] = Utils.clone(this.value[1], false);
            this.value[1] = tmp;
        } else {
            const tmp = this.value[0];
            this.value[0] = this.value[1];
            this.value[1] = tmp;
        }
    }
}
