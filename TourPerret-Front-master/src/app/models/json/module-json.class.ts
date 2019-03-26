import { HashMap, Module } from '../modules/module.class';

export class ModuleJson {

    public nom: string;
    public duree: number;
    public inputs: HashMap;

    public constructor(module: Module) {
        this.nom = module.nom;
        this.duree = module.duree;

        this.inputs = {};

        for (const inputName of Object.keys(module.inputs)) {
            this.inputs[inputName] = module.inputs[inputName].value;
        }
    }
}
