import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { PlayerService } from '../../services/player.service';
import { ApiScenarioService } from '../../services/api/api-scenario.service';
import { LiveService } from '../../services/live.service';
import { DialogService } from '../../services/dialog.service';
import { Module } from '../../models/modules/module.class';
import { ScenarioService } from '../../services/scenario.service';
import { StorageService } from '../../services/storage.service';
import { MainService } from '../../services/main.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { MatRadioChange } from '@angular/material';


@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    readonly futur: boolean = false;

    @ViewChild('sidenav') sidenav: MatSidenav;

    constructor(public apiService: ApiScenarioService, public scenarioService: ScenarioService,
                public playerService: PlayerService, public mainService: MainService,
                public dialogService: DialogService, public storageService: StorageService,
                public liveService: LiveService, public router: Router) {
    }
    ngOnInit() {
        this.mainService.toolboxOpened.subscribe((value: Module) => {
            if (value != null) {
                this.sidenav.open();
            } else {
                this.sidenav.close();
            }
        });
        this.scenarioService.open(-1);
    }

    saveModuleSideNav(): void {
        this.mainService.toolboxOpened.next(null);

        this.playerService.stop(false);
        this.scenarioService.generate();
    }

    newScenario(): void {
        this.playerService.stop();

        this.scenarioService.new();
    }

    openScenario(slot: number): void {
        this.playerService.stop();

        this.scenarioService.open(slot);
    }

    saveScenario(slot: number): void {
        this.playerService.stop(false);

        this.scenarioService.save(slot);
    }

    openScenarioFile($event: Event | any): void {
        this.playerService.stop();

        if ($event.target.files && $event.target.files.length) {
            const files: File[] = [];

            for (const file of $event.target.files) {
                files.push(file);
            }

            if (files.length) {
                this.scenarioService.openScenarioFile(files);
            }

            $event.target.value = '';
        }
    }

    sendScenario(): void {
        this.playerService.stop(false);

        if (this.futur) {
            this.router.navigate(['envoie']);
        } else {
            if (!this.scenarioService.isEmpty()) {
                this.dialogService.confirm('Envoyer le scénario', 'Êtes-vous certain de vouloir envoyer votre scénario sur la tour ?', 'Non', 'Envoyer').subscribe((result) => {
                    if (result) {
                        this.apiService.sendScenario()
                            .subscribe((data: any) => {
                                this.scenarioService.getScenario().lastSended = new Date().getTime();
                                this.dialogService.toast('Le scénario a bien été envoyé');
                            });
                    }
                });
            }
        }
    }

    exportScenario(): void {
        this.playerService.stop(false);

        if (!this.scenarioService.isEmpty()) {
            this.scenarioService.exportScenario();
        }
    }
    CommunicationMode(event : MatRadioChange):void{
      //console.log('comm : ', event.target.value)
      var MODE=false;
      if(event.source.value=='1')
      {
        MODE=true;
      }
      if(event.source.value=='0')
      {
        MODE=false;
      }
      this.liveService.sendSequenceToServer(MODE);
    }

    cursorWaiting(waiting: boolean): void {
        document.body.style.cursor = (waiting ? 'wait' : 'initial');
    }




    showLiveDialog(state: boolean): void {
        if (!this.dialogService.dialogOpened) { // ngModelChange prevent twice actions
            if (state) {
                this.dialogService.promptPlusToggle('Live sur une tour', 'Veuillez rentrer l\'adresse IP de la tour', 'Annuler', 'Se connecter', 'Adresse IP', this.liveService.ip, 'Mode API ?', this.liveService.useRest).subscribe((result) => {
                    if (result.input) {
                        this.liveService.ip = result.input;
                        this.liveService.useRest = result.toggle;
                        this.liveService.toggle(true);
                    } else {
                        this.liveService.enable = false;
                    }
                });
            } else {
                this.liveService.toggle(false);
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    keyUp(ev: KeyboardEvent) {
        if (this.dialogService.dialogOpened) {
            ev.preventDefault();

            switch (ev.keyCode) {
                case 13: // return (enter)
                    this.dialogService.closeEnterKey();
                    break;
            }
        }
    }
}
