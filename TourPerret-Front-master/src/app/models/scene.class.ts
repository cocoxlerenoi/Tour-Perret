import { Module } from './modules/module.class';
import { Sequence } from './sequence.class';
import { ModuleJson } from './json/module-json.class';
import { Scenario } from './scenario.class';

export class Scene {

    public modules: Array<Module> = [];
    public dureeTotaleScene: number = 0;

    public constructor(private scenario: Scenario) {};

    public addModule(module: Module, pos: number = -1): void {
        if (pos == -1) {
            this.modules.push(module);
        } else {
            this.modules.splice(pos, 0, module);
        }
        this.scenario.generate();
    }

    public deleteModule(which: number): any {
        this.modules.splice(which, 1);
        for (const m of this.modules) {
            m.posInScene--;
        }
        this.scenario.generate();
    }

    public clean(): void {
        this.modules.length = 0;
    }

    public generate(): void {

        this.dureeTotaleScene = 0;

        for (const mKey in this.modules) {
            const m: Module = this.modules[mKey];
            m.generate();
            m.posInScene = +mKey;
            m.scene = this;
            for (const s of m.sequences) {
                this.dureeTotaleScene += +s.duree; // cast to number with +
            }
        }
    }

    public getSequencesJsonElec(): Array<Sequence> {
        const sequences: Array<Sequence> = [];
        for (const m of this.modules) {
            for (const s of m.sequences) {
                sequences.push(s);
            }
        }
        return sequences;
    }

    public getModulesJsonEditeur(): Array<ModuleJson> {
        const modules: Array<ModuleJson> = [];

        for (const m of this.modules) {
            modules.push(new ModuleJson(m));
        }
        return modules;
    }
}
