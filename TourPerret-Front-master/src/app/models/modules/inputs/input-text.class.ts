import { Input } from './input.class';

export class InputText extends Input<string> {

    constructor(label: string, description: string, descriptionsValues: string[], value: string[], global: boolean = false) {
        super('text', label, description, descriptionsValues, value, global);
    }

    protected checkAndRectifyValue(value: string[]): string[] {
        for (const vI in value) {
            value[vI] = (value[vI].length == 0 ? 'grenoble' : value[vI]);
        }

        return value;
    }
}
