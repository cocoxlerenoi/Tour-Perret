import { Module } from './module.class';
import { Sequence } from '../sequence.class';
import { InputNumber } from './inputs/input-number';
import { InputColor } from './inputs/input-color.class';
import { CouleurRGB, Utils } from '../../services/utils.class';
import { Scenario } from '../scenario.class';

export class ModuleDegrade extends Module {

    private static readonly TIME_MINI_STEP = 50;
    private static readonly NOMBRE_ETAPE: number = 20;

    public static readonly NOM: string = 'Dégradé';
    public static readonly DESCRIPTION: string = 'Dégradé linéaire entre 2 couleurs sur une certaine durée';
    public static readonly ICONE: string = 'degrade';
    public static readonly INPUTS = {
        couleurs: new InputColor('Couleurs', null, ['Couleur de départ', 'Couleur d\'arrivée'], ['#fff', '#f0f']),
        duree: new InputNumber('Durée', null, [], [4000], true, ModuleDegrade.TIME_MINI_STEP, ModuleDegrade.TIME_MINI_STEP, Scenario.getMaxScenarioTime(), true)
    };

    public constructor() {
        super(ModuleDegrade.NOM, ModuleDegrade.DESCRIPTION, ModuleDegrade.ICONE, ModuleDegrade.INPUTS);
    }

    protected process() {
        this.inputs['duree'].checkValue();

        // Calcul du temps d'une étape en fonction de la durée et du nombre d'étapes souhaité
        let tempsEtat = Math.floor(this.inputs['duree'].getFirst() / (ModuleDegrade.NOMBRE_ETAPE + 1));

        if (tempsEtat < ModuleDegrade.TIME_MINI_STEP) {
            tempsEtat = ModuleDegrade.TIME_MINI_STEP;
        }

        const c0RGB = Utils.convertColorHexToRGB(this.inputs['couleurs'].value[0]);
        const c1RGB = Utils.convertColorHexToRGB(this.inputs['couleurs'].value[1]);

        // Calcul du différentiel entre les deux couleurs en fonction du nombre d'étapes
        const dr = (c1RGB.R - c0RGB.R) / ModuleDegrade.NOMBRE_ETAPE;
        const dg = (c1RGB.V - c0RGB.V) / ModuleDegrade.NOMBRE_ETAPE;
        const db = (c1RGB.B - c0RGB.B) / ModuleDegrade.NOMBRE_ETAPE;

        this.duree = 0;

        // Calcul des étapes suivantes
        for (let i = 0; i < ModuleDegrade.NOMBRE_ETAPE; i++) {
            const coul: CouleurRGB = {
                R: Math.abs(c0RGB.R + (dr * i)),
                V: Math.abs(c0RGB.V + (dg * i)),
                B: Math.abs(c0RGB.B + (db * i)),
                Ic: 100,
                Ib: 100
            };

            this.duree += tempsEtat;
            this.appendStep(coul, tempsEtat); // création de la séquence de l'étape courante
        }

        const leftTime: number = this.inputs['duree'].value[0] - this.duree;

        this.duree += leftTime;
        this.appendStep(c1RGB, leftTime); // création de la séquence de l'étape courante
    }

    private appendStep(coul: CouleurRGB, tempsEtat: number) {
        coul.R = Math.round(coul.R);
        coul.V = Math.round(coul.V);
        coul.B = Math.round(coul.B);
        const seq = new Sequence(coul, tempsEtat); // Création de la séquence
        this.sequences.push(seq); // Push de la séquence créée dans la liste des séquences
    }

    public generateBackground(): void {
        this.background = 'linear-gradient(to right, ' + this.inputs['couleurs'].value[0] + ' 0%, ' + this.inputs['couleurs'].value[1] + ' 100%)';
    }

    public setDuration(value: number): void {
        this.inputs['duree'].value[0] = value;
        this.inputs['duree'].checkValue();
    }
}
