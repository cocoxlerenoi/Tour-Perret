import { Injectable } from '@angular/core';
import { Scenario } from '../models/scenario.class';
import { ScenarioJsonEditeur } from '../models/json/scenario-json-editeur.class';
import { StorageService } from './storage.service';
import { DialogService } from './dialog.service';
import { saveAs } from 'file-saver';
import { ModuleCouleurStatique } from '../models/modules/module-couleur-statique.class';
import { InputColor } from '../models/modules/inputs/input-color.class';
import { InputNumber } from '../models/modules/inputs/input-number';

@Injectable()
export class ScenarioService {

    private scenario: Scenario = new Scenario();

    private static download(text, name, type) {
        saveAs(new Blob([text], {type: type}), name);
    }

    public constructor(private storageService: StorageService, private dialogService: DialogService) {
    }

    public getScenario(): Scenario {
        return this.scenario;
    }

    public generate(): void {
        this.scenario.generate();
    }

    public isEmpty(): boolean {
        return this.scenario.dureeTotale == 0;
    }

    public new(): void {
        this.dialogService.confirm('Nouveau scénario', 'Êtes-vous certain de vouloir tout recommencer ?', 'Non', 'Recommencer').subscribe((result) => {
            if (result) {
                this.scenario.clean();
            }
        });
    }

    public save(slot: number) {
        let content: string = 'Donnez un nom à votre scénario';
        let buttonOk: string = 'Enregistrer';

        if (this.storageService.getInfosScenariosSaved()[slot].dureeTotale > 0) {
            content = 'Êtes-vous certain de vouloir écraser le scénario existant ?';
            buttonOk = 'Écraser';
        }

        this.dialogService.prompt('Enregistrer le scénario', content, 'Non', buttonOk, 'Nom du scénario', this.scenario.titre).subscribe((result) => {
            if (result) {
                this.scenario.titre = result;
                this.scenario.lastSaved = new Date().getTime();
                this.storageService.saveScenario(this.scenario.getJsonEditeur(), slot);
                this.dialogService.toast('Le scénario a bien été enregistré');
            }
        });
    }

    public open(slot: number = -1): void {
        if (this.isEmpty() || slot == -1) {
            this.openScenarioSaved(slot);
        } else {
            this.dialogService.confirm('Remplacer le scénario', 'Êtes-vous certain de vouloir remplacer le scénario existant ?', 'Non', 'Remplacer').subscribe((result) => {
                if (result) {
                    this.openScenarioSaved(slot);
                }
            });
        }
    }

    private openScenarioSaved(slot: number): void {
        let scenarioSaved: ScenarioJsonEditeur = null;

        if (slot > -1) {
            scenarioSaved = this.storageService.getScenarioJsonEditeur(slot);
        } else {
            scenarioSaved = this.storageService.getFirstScenarioJsonEditeurAvailable();
        }
        if (scenarioSaved != null) {
            this.scenario.fromSaveFile(scenarioSaved);

            if (slot > -1) {
                this.dialogService.toast('Le scénario a bien été ouvert');
            }
        } else if (slot > -1) {
            this.dialogService.toast('Erreur : le scénario n\'a pas pu être ouvert');
        }
    }

    public openScenarioFile(files: File[]): void {
        if (this.isEmpty()) {
            this.openScenarioFileProcess(files);
        } else {
            this.dialogService.confirm('Remplacer le scénario', 'Êtes-vous certain de vouloir remplacer le scénario existant ?', 'Non', 'Remplacer').subscribe((result) => {
                if (result) {
                    this.openScenarioFileProcess(files);
                }
            });
        }
    }

    public openScenarioFileProcess(files: File[]): void {
        const timeBetween = 1000;

        for (const fileI in files.sort((a, b) => a.name < b.name ? -1 : 1)) {
            const file = files[fileI];

            try {
                const reader = new FileReader();
                reader.onload = () => {
                    const scenarioTodo: ScenarioJsonEditeur = JSON.parse(JSON.parse(reader.result).editeur);
                    this.scenario.fromSaveFile(scenarioTodo, +fileI !== 0);

                    if (+fileI < files.length && files.length > 1) {
                        for (let etage = 0; etage < scenarioTodo.modules.length; etage++) {
                            let max = 0;
                            for (const module of scenarioTodo.modules[etage]) {
                                max += module.duree;
                            }

                            if (max !== scenarioTodo.duree_totale) {
                                const module: ModuleCouleurStatique = new ModuleCouleurStatique();
                                module.inputs = {
                                    couleurs: new InputColor('Couleur', null, [], ['#000']),
                                    duree: new InputNumber('Durée', null, [], [scenarioTodo.duree_totale - max], true, 50, 50, Scenario.getMaxScenarioTime())
                                };
                                module.editable = true;
                                this.scenario.scenes[etage].addModule(module);
                            }

                            if (timeBetween) {
                                const module: ModuleCouleurStatique = new ModuleCouleurStatique();
                                module.inputs = {
                                    couleurs: new InputColor('Couleur', null, [], ['#000']),
                                    duree: new InputNumber('Durée', null, [], [timeBetween], true, 50, 50, Scenario.getMaxScenarioTime())
                                };
                                module.editable = true;

                                this.scenario.scenes[etage].addModule(module);
                            }
                        }

                        this.scenario.generate();
                    }
                };
                reader.readAsText(file);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public exportScenario(): void {
        this.scenario.generate();

        const content: string = 'Donnez un nom à votre scénario';

        this.dialogService.prompt('Exporter le scénario', content, 'Annuler', 'Exporter', 'Nom du scénario', this.scenario.titre).subscribe((result) => {
            if (result) {
                this.scenario.titre = result;

                ScenarioService.download(JSON.stringify({
                    editeur: JSON.stringify(this.scenario.getJsonEditeur()),
                    elec: JSON.stringify(this.scenario.generateElec())
                }), 'scenario-' + new Date().getTime() + '-' + this.scenario.titre + '.json', 'application/json');

                this.dialogService.toast('Le scénario a bien été exporté');
            }
        });
    }
}
