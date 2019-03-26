import { Sequence } from '../sequence.class';
import { Scenario } from '../scenario.class';

export class ScenarioJsonElec {

    public duree_totale: number = 0;
    public scenes: Array<Array<Sequence>> = [];

    public constructor(scenario: Scenario) {
        this.duree_totale = scenario.dureeTotale;

        for (const s of scenario.scenes) {
            this.scenes.push(s.getSequencesJsonElec());
        }
    }
}
