import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Scenario } from '../../../../models/scenario.class';
import { ScenarioService } from '../../../../services/scenario.service';
import { DragulaService } from '../../../shared/dragula/dragula.provider';
import { StretchModuleService } from '../../../../services/stretch-module.service';
import { MainService } from '../../../../services/main.service';
import { PlayerService } from '../../../../services/player.service';
import { DialogService } from '../../../../services/dialog.service';
import { Module } from '../../../../models/modules/module.class';

@Component({
    selector: 'my-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewChecked {

    scenario: Scenario;
    secBar: number[] = [];

    readonly secBarChoosen: number = 5;
    readonly minZoom: number = 1;
    readonly maxZoom: number = 7;

    private lastZoom: number = -1;

    @ViewChild('barPreview') private barPreview: ElementRef;

    constructor(public scenarioService: ScenarioService, public playerService: PlayerService,
                dragulaService: DragulaService, public mainService: MainService,
                public stretchModuleService: StretchModuleService, public elRef: ElementRef,
                public dialogService: DialogService) {
        this.scenario = this.scenarioService.getScenario();

        dragulaService.dropModel.subscribe((value) => {
            // value[3] = source        value[2] = target
            if (value[2].className === 'modules-line') {
                const module: Module = value[4];
                module.editable = true;

                this.playerService.stop(false);
                this.scenarioService.generate();
            }
        });

        this.playerService.incrementTimer.subscribe(() => {
            const wrapper: Element = this.elRef.nativeElement.querySelector('.modules-builder-wrapper');

            if (this.playerService.getTimer() == 0) {
                wrapper.scrollLeft = 0;
            } else {
                const left: number =
                    (this.playerService.getTimer() > 0 ?
                        this.elRef.nativeElement.querySelector('.modules-line').offsetLeft : 0) +
                    this.mainService.getWidth(this.playerService.getTimer());

                this.barPreview.nativeElement.style.left = left + 'px';

                if (left >= wrapper.getBoundingClientRect().width + wrapper.scrollLeft) {
                    wrapper.scrollLeft = left;
                }
            }
        });
    }

    private getBarPosition(millisecond): number {
        return this.elRef.nativeElement.querySelector('.modules-line').offsetLeft +
            this.mainService.getWidth(millisecond);
    }

    ngAfterViewChecked() {
        if (this.lastZoom != this.mainService.zoom) {
            this.lastZoom = this.mainService.zoom;
            this.generateBarSec();
        }
    }

    private generateBarSec(): void {
        const modulesLines: Element = this.elRef.nativeElement.querySelector('.modules-line');
        this.secBar.length = 0;

        if (modulesLines) {
            const max: number = this.mainService.getValue(modulesLines.getBoundingClientRect().width) / (1000 * this.secBarChoosen) - 1;

            for (let i = 0; i < max; i++) {
                this.secBar[i] = (i + 1) * 1000 * this.secBarChoosen;
            }
        }
    }

    togglePlaying(): void {
        if (this.playerService.isSuspended()) {
            this.playerService.play();
        } else {
            this.playerService.pause();
        }
    }

    zoomPlus(): void {
        if (this.mainService.zoom > this.minZoom) {
            this.mainService.zoom--;
        }
    }

    zoomMoins(): void {
        if (this.mainService.zoom < this.maxZoom) {
            this.mainService.zoom++;
        }
    }

    paste(etage: number): void {
        this.scenario.scenes[etage].addModule(this.mainService.getModuleSaved());
    }

    copyLine(etage: number): void {
        this.mainService.setEtageSaved(this.scenario.scenes[etage].modules);
    }

    pasteLine(etage: number): void {
        for (const module of this.mainService.getEtageSaved()) {
            this.scenario.scenes[etage].addModule(module);
        }
    }

    cleanLine(etage: number): void {
        if (this.scenario.scenes[etage].modules.length > 0) {
            this.dialogService.confirm('Vider la ligne de temps', 'Êtes-vous certain de vouloir vider cette ligne de temps ?', 'Non', 'Vider').subscribe((result) => {
                if (result) {
                    this.scenario.scenes[etage].modules.length = 0;
                    this.scenarioService.generate();
                }
            });
        }
    }

    @HostListener('document:keyup', ['$event'])
    keyUp(ev: KeyboardEvent) {
        if (!this.dialogService.dialogOpened) {
            ev.preventDefault();

            switch (ev.keyCode) {
                case 32: // spacebar
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.togglePlaying();
                    break;

                case 83: // s key
                    this.playerService.stop();
                    break;

                case 107: // add numpad
                    this.zoomPlus();
                    break;

                case 109: // substract numpad
                    this.zoomMoins();
                    break;
            }
        }
    }

    @HostListener('mouseup')
    onMouseup() {
        this.stretchModuleService.release();
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.stretchModuleService.isStretching()) {
            this.playerService.stop(false);
            this.stretchModuleService.doSize(event);
        }
    }
}
