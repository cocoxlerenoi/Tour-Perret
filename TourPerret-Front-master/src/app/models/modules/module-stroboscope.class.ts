import { HashMap, Module } from './module.class';
import { Sequence } from '../sequence.class';
import { InputNumber } from './inputs/input-number';
import { InputColor } from './inputs/input-color.class';
import { Utils } from '../../services/utils.class';
import { ModuleClignotement } from './module-clignotement.class';

export class ModuleStroboscope extends Module {

    public static readonly NOM: string = 'Stroboscope';
    public static readonly DESCRIPTION: string = 'Permet de faire clignoter rapidement';
    public static readonly ICONE: string = 'stroboscope';
    public static readonly INPUTS: HashMap = {
        couleurs: new InputColor('Couleur', null, [], ['#FFF']),
        vitesse: new InputNumber('Vitesse', 'La vitesse du stroboscope', ['Entre 1 et 10'], [5], false, 1, 1, 10, false)
    };

    public static readonly OFFSET_TIME: number = 100;
    public static readonly TIME_MULTIPLY: number = 10;

    public constructor() {
        super(ModuleStroboscope.NOM, ModuleStroboscope.DESCRIPTION, ModuleStroboscope.ICONE, ModuleStroboscope.INPUTS);

        this.duree = 4000; // initiale
    }

    protected process(): void {
        this.inputs['vitesse'].checkValue();

        const speed: number = this.getSpeed();
        const repetitions: number = this.getRepetitions();

        const dureeTotale: number = ModuleClignotement.computeProcess(this.sequences,
            speed, speed,
            '#000', this.inputs['couleurs'].getFirst(),
            repetitions
        );

        if (dureeTotale != this.duree) {
            this.sequences.push(new Sequence(Utils.convertColorHexToRGB('#000'), this.duree - dureeTotale));
        }
    }

    public generateBackground(): void {
        const speed: number = this.getSpeed();
        const repetitions: number = this.getRepetitions();

        const step: number = Math.floor(100 / repetitions);
        const stepC: number = step / 2;

        this.background = ModuleClignotement.computeBackground(
            step, stepC, stepC,
            '#000', this.inputs['couleurs'].getFirst()
        );
    }

    public setDuration(value: number): void {
        this.duree = value;
    }

    private getSpeed(): number {
        return (this.inputs['vitesse'].max - this.inputs['vitesse'].getFirst()) * ModuleStroboscope.TIME_MULTIPLY + ModuleStroboscope.OFFSET_TIME;
    }

    private getRepetitions(): number {
        return Math.floor(this.duree / (this.getSpeed() * 2));
    }
}
