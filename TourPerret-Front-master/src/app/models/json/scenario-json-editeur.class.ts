import { Scenario } from '../scenario.class';
import { ModuleJson } from './module-json.class';
import { Marker } from '../marker';

export class ScenarioJsonEditeur {

    public duree_totale: number = 0;
    public modules: Array<Array<ModuleJson>> = [];
    public titre: string = null;
    public last_saved: number = 0;
    public last_sended: number = 0;
    public markers: Marker[] = [];

    public constructor(scenario: Scenario) {
        this.duree_totale = scenario.dureeTotale;
        this.titre = scenario.titre;
        this.last_saved = scenario.lastSaved;
        this.last_sended = scenario.lastSended;
        this.markers = scenario.markers;

        for (const s of scenario.scenes) {
            this.modules.push(s.getModulesJsonEditeur());
        }
    }
}
