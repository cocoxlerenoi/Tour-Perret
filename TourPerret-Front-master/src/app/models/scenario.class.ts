import { Scene } from './scene.class';
import { Module } from './modules/module.class';
import { ScenarioJsonElec } from './json/scenario-json-elec.class';
import { ScenarioJsonEditeur } from './json/scenario-json-editeur.class';
import { Sequence } from './sequence.class';
import { Marker } from './marker';

export class Scenario {

    public static readonly MINIMUM_TIME_SEQUENCE: number = 25;
    public static readonly MAX_SCENARIO_MINUTES: number = 5;

    public scenes: Array<Scene> = [];
    public dureeTotale: number = 0;
    public titre: string = '';
    public lastSaved: number = 0;
    public lastSended: number = 0;
    public markers: Marker[] = [];

    public static getMaxScenarioTime(): number {
        return Scenario.MAX_SCENARIO_MINUTES * 60 * 1000;
    }

    public constructor() {
        this.scenes.push(new Scene(this));
        this.scenes.push(new Scene(this));
        this.scenes.push(new Scene(this));
    }

    public generate(): void {
        this.dureeTotale = 0;

        for (const s of this.scenes) {
            s.generate();
            if (s.dureeTotaleScene > this.dureeTotale) {
                this.dureeTotale = s.dureeTotaleScene;
            }
        }
    }

    /*
        [
            [RGB étage 1 (int), RGB étage 2 (int), RGB étage 3 (int), temps ms],
        ]
     */
    public generateElec(): any[] {
        this.generate();

        const scenario: number[][] = [];

        const allSequences: Sequence[][] = [];

        for (const s of this.scenes) {
            allSequences.push(s.getSequencesJsonElec());
        }

        let first: boolean = true;
        const steps: number[] = []; // sur quelles etapes on est pour chaque étage
        const colorsToAdd: number[] = []; // les nouvelles couleurs
        const nextChange: number[] = []; // le temps en ms avant le prochain changement

        for (let etage = 0; etage < allSequences.length; etage++) { // pour chaque etage
            steps.push(0);
            colorsToAdd.push(0);
            nextChange.push(0);
        }
        colorsToAdd[allSequences.length] = 0;

        // console.log(allSequences);

        while (this.generateElecWhile(allSequences, steps, nextChange)) {
            // on regarde celui qui a la plus petite durée parmis les étages qui ont encore des séquences (pour enlever les 0ms)
            let min: number = this.minWithCorrectEtage(steps, nextChange, allSequences);

            if (first) {
                first = false;
                min = 0;
            }

            // console.log('Temps prochain : ' + min + 'ms');

            for (let etage = 0; etage < allSequences.length; etage++) { // pour chaque etage
                nextChange[etage] -= min; // on enlève le temps minimum des séquences courantes

                if (steps[etage] < allSequences[etage].length) { // si ce n'est pas la dernière séquence
                    const current: Sequence = allSequences[etage][steps[etage]]; // on prend la séquence

                    // console.log('Etage n°' + etage, 'Etape n°' + steps[etage], current, 'Prochain changement dans ' + nextChange[etage] + 'ms');

                    if (nextChange[etage] <= 0) { // s'il est temps de la jouer
                        colorsToAdd[allSequences.length - 1 - etage] = current.getColorHasNumber();
                        steps[etage]++; // on passe à la séquence d'après
                        nextChange[etage] = current.duree; // on dit dans combien de temps on la joue
                    }
                } else if (nextChange[etage] <= 0) {
                    colorsToAdd[allSequences.length - 1 - etage] = 0;
                }
            }

            /*
                La nouvelle couleur a la plus petite durée des séquences courantes.
                On le refait car il y a pu avoir au maximum 3 changements dans la boucle for.
             */
            min = this.minWithCorrectEtage(steps, nextChange, allSequences);
            if (min < Number.MAX_SAFE_INTEGER) {
                colorsToAdd[allSequences.length] = min;

                // console.log(colorsToAdd, nextChange, steps);

                scenario.push(colorsToAdd.slice(0)); // on copie notre couleur et on la met à la fin du gros tableau
            }
        }

        // console.log(scenario, JSON.stringify(scenario));

        return scenario;
    }

    private minWithCorrectEtage(steps: number[], nextChange: number[], allSequences: Sequence[][]): number {
        let min: number = Number.MAX_SAFE_INTEGER; // on regarde celui qui a la plus petite durée
        for (let etage = 0; etage < allSequences.length; etage++) {
            // console.log(etage, steps[etage], allSequences[etage].length, nextChange[etage], min);
            if (steps[etage] != allSequences[etage].length || nextChange[etage] > 0) { // si l'étage a encore des séquences à jouer
                if (nextChange[etage] < min) {
                    min = nextChange[etage];
                }
            }
        }

        return (min < Scenario.MINIMUM_TIME_SEQUENCE ? Scenario.MINIMUM_TIME_SEQUENCE : min);
    }

    private generateElecWhile(allSequences: Sequence[][], steps: number[], nextChange: number[]): boolean {
        let result: boolean = false;

        for (let etage = 0; etage < allSequences.length; etage++) {
            result = result
                || steps[etage] < allSequences[etage].length // si il reste des séquences à jouer
                || nextChange[etage] > 0; // si on a pas fini les dernières séquences
        }

        return result;
    }

    public clean(): void {
        this.titre = '';
        this.lastSaved = 0;
        this.lastSended = 0;
        this.markers.length = 0;

        for (const s of this.scenes) {
            s.clean();
        }
        this.generate();
    }

    public getJsonElec(): ScenarioJsonElec {
        this.generate();

        return new ScenarioJsonElec(this);
    }

    public getJsonEditeur(): ScenarioJsonEditeur {
        this.generate();

        return new ScenarioJsonEditeur(this);
    }

    public fromSaveFile(data: ScenarioJsonEditeur, append: boolean = false): void {
        if (!append) {
            this.titre = data.titre;
            this.lastSaved = data.last_saved;
            this.lastSended = data.last_sended;
            this.markers.length = 0;
        }

        for (let etage = 0; etage < this.scenes.length; etage++) {
            if (!append) {
                this.scenes[+etage].modules.length = 0;
            }

            for (const moduleJson of data.modules[+etage]) {
                try {
                    const module: Module = Module.convertModuleJsonToModule(moduleJson);
                    module.editable = true;
                    this.scenes[+etage].addModule(module);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        for (const marker of data.markers) {
            marker.time += this.dureeTotale - data.duree_totale;
            this.markers.push(marker);
        }

        this.generate();
    }

    public isEmpty(): boolean {
        return this.scenes[0].modules.length == 0 && this.scenes[1].modules.length == 0 && this.scenes[2].modules.length == 0;
    }
}
