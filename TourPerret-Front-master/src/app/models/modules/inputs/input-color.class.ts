import { Input } from './input.class';

export class InputColor extends Input<string> {

    constructor(label: string, description: string, descriptionsValues: string[], value: string[], global: boolean = false) {
        super('color', label, description, descriptionsValues, value, global);
    }
}
