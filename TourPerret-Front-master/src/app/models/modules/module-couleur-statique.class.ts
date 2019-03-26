import { Module } from './module.class';
import { Sequence } from '../sequence.class';
import { InputNumber } from './inputs/input-number';
import { InputColor } from './inputs/input-color.class';
import { Utils } from '../../services/utils.class';
import { Scenario } from '../scenario.class';

export class ModuleCouleurStatique extends Module {

    public static readonly NOM: string = 'Couleur';
    public static readonly DESCRIPTION: string = 'Couleur Statique';
    public static readonly ICONE: string = 'couleur-statique';
    public static readonly INPUTS = {
        couleurs: new InputColor('Couleur', null, [], ['#0ff']),
        duree: new InputNumber('Durée', null, [], [4000], true, 50, 50, Scenario.getMaxScenarioTime())
    };

    public constructor() {
        super(ModuleCouleurStatique.NOM, ModuleCouleurStatique.DESCRIPTION, ModuleCouleurStatique.ICONE, ModuleCouleurStatique.INPUTS);
    }

    protected process() {
        this.inputs['duree'].checkValue();

        const seq = new Sequence(
            Utils.convertColorHexToRGB(this.inputs['couleurs'].getFirst()),
            this.inputs['duree'].getFirst()
        ); // Création de la séquence
        this.sequences.push(seq); // Push de la séquence créée dans la liste des séquences

        this.duree = this.inputs['duree'].getFirst();
    }

    public setDuration(value: number): void {
        this.inputs['duree'].value[0] = value;
        this.inputs['duree'].checkValue();
    }
}
