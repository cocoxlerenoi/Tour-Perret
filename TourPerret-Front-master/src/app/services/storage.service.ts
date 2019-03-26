import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage/dist';
import { ScenarioJsonEditeur } from '../models/json/scenario-json-editeur.class';
import { ModuleJson } from '../models/json/module-json.class';

@Injectable()
export class StorageService {

    private static readonly SCENARIO_KEY: string = 'scenario';
    private static readonly FAVORITES_MODULES_KEY: string = 'favoritesModules';
    private static readonly LAST_SCENARIO_OPENED: string = 'lastScenarioOpened';
    private static readonly MAX_SLOT_SCANARIO: number = 5;

    private scenarioInfos: ScenarioInfos[] = null;

    public constructor(private localStorageService: LocalStorageService) {
    }

    public getScenarioJsonEditeur(slot: number = 0): ScenarioJsonEditeur {
        const scenarios: ScenarioJsonEditeur[] = this.localStorageService.get(StorageService.SCENARIO_KEY) as ScenarioJsonEditeur[];

        if (slot < scenarios.length && scenarios[slot] != null) {
            this.localStorageService.set(StorageService.LAST_SCENARIO_OPENED, slot);
            return scenarios[slot];
        } else {
            return null;
        }
    }

    public getFirstScenarioJsonEditeurAvailable(): ScenarioJsonEditeur {
        const lastScenarioOpened: number = this.localStorageService.get(StorageService.LAST_SCENARIO_OPENED) as number;
        const scenarios: ScenarioJsonEditeur[] = this.localStorageService.get(StorageService.SCENARIO_KEY) as ScenarioJsonEditeur[];

        if (scenarios) {
            if (lastScenarioOpened && scenarios[lastScenarioOpened] != null) {
                return scenarios[lastScenarioOpened];
            } else {
                let slot: number = 0;
                while (slot < scenarios.length && scenarios[slot] == null) {
                    slot++;
                }

                if (scenarios[slot] != null) {
                    return scenarios[slot];
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }

    public getInfosScenariosSaved(force: boolean = false): ScenarioInfos[] {
        if (this.scenarioInfos == null || force) {
            this.scenarioInfos = [];

            let scenarios: ScenarioJsonEditeur[] = this.localStorageService.get(StorageService.SCENARIO_KEY) as ScenarioJsonEditeur[];

            if (scenarios == null) {
                scenarios = [];
            }

            let i: number = 0;
            while (i < StorageService.MAX_SLOT_SCANARIO) {
                const scenario: ScenarioJsonEditeur = scenarios[i];

                if (scenario != null) {
                    this.scenarioInfos.push({
                        slot: +i,
                        titre: scenario.titre,
                        dureeTotale: scenario.duree_totale,
                        lastSaved: scenario.last_saved,
                        lastSended: scenario.last_sended
                    });
                } else {
                    this.scenarioInfos.push({
                        slot: +i,
                        titre: null,
                        dureeTotale: 0,
                        lastSaved: 0,
                        lastSended: 0
                    });
                }

                i++;
            }
        }

        return this.scenarioInfos;
    }

    public hasScenarioSaved(): boolean {
        return this.localStorageService.get(StorageService.SCENARIO_KEY) != null;
    }

    public saveScenario(scenario: ScenarioJsonEditeur, slot: number): void {
        if (slot < StorageService.MAX_SLOT_SCANARIO) {
            let scenarios: ScenarioJsonEditeur[] = this.localStorageService.get(StorageService.SCENARIO_KEY) as ScenarioJsonEditeur[];
            if (scenarios == null) {
                scenarios = [];
            }
            scenarios[slot] = scenario;

            this.localStorageService.set(StorageService.SCENARIO_KEY, scenarios);
            this.localStorageService.set(StorageService.LAST_SCENARIO_OPENED, slot);
            this.getInfosScenariosSaved(true);
        }
    }


    public getFavoritesModules(): ModuleJson[] {
        const favoritesModules: string = this.localStorageService.get('favoritesModules') as string;

        return (favoritesModules != null ? JSON.parse(favoritesModules) : []);
    }

    public saveFavoritesModules(favoritesModules: ModuleJson[]): void {
        this.localStorageService.set(StorageService.FAVORITES_MODULES_KEY, JSON.stringify(favoritesModules));
    }
}

export interface ScenarioInfos {
    slot: number;
    titre: string;
    dureeTotale: number;
    lastSaved: number;
    lastSended: number;
}
