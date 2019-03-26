import { CouleurRGB, Utils } from '../services/utils.class';

export class Sequence {

    public constructor(
        public couleur: CouleurRGB,
        public duree: number = 0
    ) { };

    public getColorHasNumber(): number {
        return Utils.convertColorRGBToNumber(this.couleur);
    }
}
