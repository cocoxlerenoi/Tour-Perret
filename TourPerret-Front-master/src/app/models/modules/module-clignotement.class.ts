import { HashMap, Module } from './module.class';
import { Sequence } from '../sequence.class';
import { InputNumber } from './inputs/input-number';
import { InputColor } from './inputs/input-color.class';
import { CouleurRGB, Utils } from '../../services/utils.class';
import { Scenario } from '../scenario.class';

export class ModuleClignotement extends Module {

    public static readonly NOM: string = 'Clignotement';
    public static readonly DESCRIPTION: string = 'Permet de faire clignoter avec 2 durées et 2 couleurs différentes';
    public static readonly ICONE: string = 'clignotement';
    public static readonly INPUTS: HashMap = {
        repetitions: new InputNumber('Répétitions', 'Le nombre de répétitions de la couleur 1 puis de la couleur 2', ['Nombre de répetitions des 2 couleurs'], [1], true, 1, 1, 10, false),
        couleurs: new InputColor('Couleurs', null, [], ['#0f0', '#ff0']),
        durees: new InputNumber('Durées', 'Les durées pour chaque couleur', ['Pour la couleur 1', 'Pour la couleur 2'], [500, 500], false, 50, 50, Scenario.getMaxScenarioTime())
    };

    public static computeProcess(sequences: Sequence[], dureeC0: number, dureeC1: number,
                                 c0: string, c1: string, repetitions: number): number {
        const c0RGB: CouleurRGB = Utils.convertColorHexToRGB(c0);
        const c1RGB: CouleurRGB = Utils.convertColorHexToRGB(c1);
        let dureeTotale: number = 0;

        for (let i = 0; i < repetitions; i++) {
            sequences.push(new Sequence(c0RGB, dureeC0));
            sequences.push(new Sequence(c1RGB, dureeC1));

            dureeTotale += dureeC0 + dureeC1;
        }

        return dureeTotale;
    }

    public static computeBackground(step: number, stepC0: number, stepC1: number,
                                    c0: string, c1: string): string {
        let gradient: string = 'linear-gradient(to right';

        for (let i = 0; i < 100; i += step) {
            for (let j = 0; j < stepC0; j++) {
                gradient += ', ' + c0 + ' ' + (i + j) + '%';
            }
            for (let j = 0; j < stepC1; j++) {
                if (i + stepC0 + j > 100) {
                    break;
                }
                gradient += ', ' + c1 + ' ' + (i + stepC0 + j) + '%';
            }
        }

        return gradient + ')';
    }


    public constructor() {
        super(ModuleClignotement.NOM, ModuleClignotement.DESCRIPTION, ModuleClignotement.ICONE, ModuleClignotement.INPUTS);
    }

    protected process(): void {
        this.inputs['repetitions'].checkValue();
        this.inputs['durees'].checkValue();

        this.duree = ModuleClignotement.computeProcess(this.sequences,
            this.inputs['durees'].value[0],
            this.inputs['durees'].value[1],
            this.inputs['couleurs'].value[0],
            this.inputs['couleurs'].value[1],
            this.inputs['repetitions'].getFirst()
        );
    }

    public generateBackground(): void {
        const step: number = Math.floor(100 / (this.inputs['repetitions'].getFirst()));
        const stepTotal: number = this.inputs['durees'].value[0] + this.inputs['durees'].value[1];
        const stepC0: number = Math.round(this.inputs['durees'].value[0] * step / stepTotal);
        const stepC1: number = Math.round(this.inputs['durees'].value[1] * step / stepTotal);

        this.background = ModuleClignotement.computeBackground(
            step, stepC0, stepC1,
            this.inputs['couleurs'].value[0], this.inputs['couleurs'].value[1]
        );
    }

    public setDuration(value: number): void {
        this.inputs['durees'].value[0] = Math.round(value / this.inputs['repetitions'].getFirst() / 2);
        this.inputs['durees'].value[1] = Math.round(value / this.inputs['repetitions'].getFirst() / 2);
        this.inputs['durees'].checkValue();
    }
}
