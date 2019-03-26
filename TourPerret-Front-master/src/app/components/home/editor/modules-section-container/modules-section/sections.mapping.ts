import { Module } from '../../../../../models/modules/module.class';
import { ModuleCouleurStatique } from '../../../../../models/modules/module-couleur-statique.class';
import { ModuleClignotement } from '../../../../../models/modules/module-clignotement.class';
import { ModuleDegrade } from '../../../../../models/modules/module-degrade.class';
import { ModuleStroboscope } from '../../../../../models/modules/module-stroboscope.class';

export interface InputMap {
    colors: ColorsMap[];
}
export interface ColorsMap {
    R: number;
    V: number;
    B: number;
}

export interface SectionsMap {
    name: string;
    modules: Module[];
}

export const SectionsMapping = [
    {
        'name': 'Basiques',
        'modules': [
            new ModuleCouleurStatique(),
            new ModuleClignotement(),
            new ModuleDegrade(),
            // new ModuleMorse(),
            new ModuleStroboscope()
        ]
    },
    {
        'name': 'Favoris',
        'modules': [
        ]
    },
];
