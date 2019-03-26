import { EventEmitter, Injectable } from '@angular/core';
import { ScenarioService } from './scenario.service';
import { Utils } from './utils.class';
import { LiveService } from './live.service';




@Injectable()
export class PlayerService {

    public static readonly MINIMUM_DUREE_SEQUENCE: number = 25;
    public static readonly DIVIDE_SPEED: number = 1;
    public static readonly USE_ELEC: boolean = true;
    public static readonly BLACK_ALL: number[] = [0, 0, 0, 0];

    public incrementTimer: EventEmitter<number> = new EventEmitter();
    public loop: boolean = false;

    private audioPlayer: HTMLMediaElement;
    private graphicsEtage: Array<CanvasRenderingContext2D> = [];
    private previewTick: any = null;
    private timerTick: any = null;
    private timerBar: number = 0;
    private timerPreview: number = 0;
    private suspend: boolean = true;

    private avancement: number = 0;
    private scenario: number[][] = null;

    public constructor(private scenarioService: ScenarioService, private liveService: LiveService) {}

    public setCanvas(canvasEtage3, canvasEtage2, canvasEtage1) {
        this.graphicsEtage.push(canvasEtage3.nativeElement.getContext('2d'));
        this.graphicsEtage.push(canvasEtage2.nativeElement.getContext('2d'));
        this.graphicsEtage.push(canvasEtage1.nativeElement.getContext('2d'));
    }

    public setAudioPlayer(audioPlayer: HTMLMediaElement, fileUrl: string) {
        this.stop();
        this.audioPlayer = audioPlayer;
        this.audioPlayer.src = fileUrl;
    }

    public playJson(): void {
        const json: any = this.scenarioService.getScenario().getJsonElec();

        const steps: Array<any> = [];

        for (const s in json.scenes) {
            const t: any = json.scenes[s];
            if (t.length > 0) {
                steps[s] = {
                    i: 0,
                    lastTime: 0,
                };

                this.setEtage(+s, t[0].couleur.R, t[0].couleur.V, t[0].couleur.B, t[0].couleur.Ic);
            }
        }

        const self = this;
        this.previewTick = setInterval(function () {
            if (!self.suspend) {
                self.timerPreview += PlayerService.MINIMUM_DUREE_SEQUENCE;

                self.incrementTimer.emit(self.timerPreview);

                for (const key in steps) {
                    const value = steps[key];
                    let dataNow = json.scenes[key][value.i];

                    if (self.timerPreview - value.lastTime >= dataNow.duree) {
                        if ((json.scenes[key] as any).length > value.i + 1) {
                            value.i++;
                            dataNow = json.scenes[key][value.i];
                            self.setEtage(+key, dataNow.couleur.R, dataNow.couleur.V, dataNow.couleur.B, dataNow.couleur.Ic);
                            value.lastTime = self.timerPreview;
                        } else {
                            value.lastTime = json.duree_totale;
                            self.setEtage(+key, 0, 0, 0, 0);
                        }
                    }
                }

                if (self.timerPreview >= json.duree_totale) {
                    self.stop();

                    if (self.loop) {
                        self.play();
                    }
                }
            }
        }, PlayerService.MINIMUM_DUREE_SEQUENCE);
    }

    public playElec(timerMinus: number = 0): void {
        if (this.timerTick == null) {
            const self = this;
            this.timerTick = setInterval(function () {
                if (!self.isSuspended()) {
                    self.timerBar += PlayerService.MINIMUM_DUREE_SEQUENCE * PlayerService.DIVIDE_SPEED;
                    self.incrementTimer.emit(self.timerBar);
                }
            }, PlayerService.MINIMUM_DUREE_SEQUENCE * PlayerService.DIVIDE_SPEED);
        }

        if (!this.isSuspended()) {
            /*
                [RGB étage 1 (int), RGB étage 2 (int), RGB étage 3 (int), temps ms]
             */
            const current: number[] = this.scenario[this.avancement];

            for (let etage = 0; etage < current.length - 1; etage++) {
                const c: number[] = Utils.getColorFromNumber(current[current.length - 2 - etage]); // inversion de l'étage 1 et 3
                this.setEtage(etage, c[0], c[1], c[2], c[3]);
            }

            if (this.liveService.enable) {
               // this.liveService.sendSequenceToServer(current);
            }

            if (this.scenario.length - 1 > this.avancement) {
                this.avancement++;
                this.timerBar = this.timerPreview + timerMinus;

                const self = this;
                this.previewTick = setTimeout(function () {
                    self.timerPreview += current[current.length - 1] * PlayerService.DIVIDE_SPEED;
                    self.playElec();
                }, (current[current.length - 1] - timerMinus) * PlayerService.DIVIDE_SPEED, this);
            } else {
                this.stop();

                if (this.loop) {
                    this.play();
                }
            }
        }
    }

    public toggle(): void {
        if (this.isSuspended()) {
            this.play();
        } else {
            this.pause();
        }
    }

    public play(): void
	{
        if (this.isSuspended() && this.getTimer() == 0) {
            this.stop();

            this.suspend = false;
            this.changeSupend(false);

            if (PlayerService.USE_ELEC)
			{
                this.scenario = this.scenarioService.getScenario().generateElec();
                //this.scenario.push(PlayerService.BLACK_ALL); // pour voir la dernière séquence
                this.playElec();
				console.log('Sequence play : ' + this.scenario); // senario contient le senario a envoyer

        //Debut Envoi

//				console.log('deb envoi')

			this.liveService.sendSequenceToServer(this.scenario);
//				console.log('fin envoi');

        //Fin envoi

            } else {
                this.playJson();
            }
        } else {
            this.changeSupend(false);
        }

        if (this.audioPlayer) {
            this.audioPlayer.play();
        }
    }

    public pause() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }

        if (PlayerService.USE_ELEC) {
            clearTimeout(this.previewTick);
            this.previewTick = null;
        }

        this.changeSupend(true);
    }

    public stop(emit: boolean = true): void {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }

        if (PlayerService.USE_ELEC) {
            clearInterval(this.timerTick);
            this.timerTick = null;
            clearTimeout(this.previewTick);

            this.avancement = 0;
            this.scenario = null;
            this.timerBar = 0;

            if (this.liveService.enable) {
                //this.liveService.sendSequenceToServer(PlayerService.BLACK_ALL);
            }
        } else {
            clearInterval(this.previewTick);
        }
        this.previewTick = null;
        this.timerPreview = 0;

        this.changeSupend(true);

        this.clearAllEtages();

        if (emit) {
            this.incrementTimer.emit(this.timerBar);
        }
    }

    private changeSupend(suspend: boolean): void {
        this.suspend = suspend;

        if (PlayerService.USE_ELEC && this.suspend == false && this.timerBar > 0) { // si elec et en lecture
            if (this.avancement > 0) {
                this.avancement--; // on recule d'un séquence
            }
            this.playElec(this.timerBar - this.timerPreview);
        }
    }

    public isSuspended(): boolean {
        return this.suspend;
    }

    public getTimer(): number {
        return (PlayerService.USE_ELEC ? this.timerBar : this.timerPreview);
    }

    private setEtage(i: number, r: number, v: number, b: number, a: number): void {
        this.graphicsEtage[i].fillStyle = 'rgb(' + r + ',' + v + ',' + b + ')';
        this.graphicsEtage[i].fillRect(0, 0, 1000, 1000);
    }

    private clearAllEtages() {
        for (let etage = 0; etage < this.scenarioService.getScenario().scenes.length; etage++) {
            this.setEtage(etage, 128, 128, 128, 0);
        }
    }
}
