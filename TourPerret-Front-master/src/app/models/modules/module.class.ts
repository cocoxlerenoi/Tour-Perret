import { Sequence } from '../sequence.class';
import { Scene } from '../scene.class';
import { ModuleJson } from '../json/module-json.class';
import { Utils } from '../../services/utils.class';

export interface HashMap {
    [key: string]: any;
}
export abstract class Module {

    public static allModules: HashMap = {};

    public sequences: Array<Sequence> = [];
    public duree: number = 0;

    public editable: boolean = false;
    public original: boolean = true;
    public scene: Scene = null;
    public posInScene: number = -1;

    protected background: string = null;

    public static convertModuleJsonToModule(moduleJson: ModuleJson): Module {
        const nom: any = Utils.removeAccent(moduleJson.nom.replace('Module', '').replace('Statique', ''));
        const module: Module = Utils.clone(Module.allModules[nom], false);

        for (const input in moduleJson.inputs) {
            module.inputs[input].setValue(moduleJson.inputs[input]);
        }

        module.generate();

        return module;
    }

    public constructor(
        public nom: string,
        public description: string,
        public icon: string,
        public inputs: HashMap
    ) {
        if (Module.allModules[Utils.removeAccent(nom) as any] == null) {
            Module.allModules[Utils.removeAccent(nom) as any] = this;
        }
    }

    protected abstract process(): void;

    public cloneInScene(): void {
        this.scene.addModule(this.getClone(), this.posInScene + 1);
    }

    public generate(): void {
        this.sequences.length = 0;
        this.process();

        this.generateBackground();
    }

    public delete(): void {
        if (this.scene != null && this.posInScene >= 0) {
            this.scene.deleteModule(this.posInScene);
        }
    }

    public getJSONToSave(): ModuleJson {
        return new ModuleJson(this);
    }

    public getClone(): Module {
        const module: Module = Module.convertModuleJsonToModule(this.getJSONToSave());
        module.editable = this.editable;
        module.original = this.original;

        return module;
    }

    public getIconPath(): string {
        return 'assets/img/modules-icons/' + this.icon + '.png';
    }

    public generateBackground(): void {
        this.background = this.inputs['couleurs'].getFirst();
    }

    public getBackground(): string {
        if (this.background == null) {
            this.generateBackground();
        }
        return this.background;
    }

    public abstract setDuration(value: number): void;
}
