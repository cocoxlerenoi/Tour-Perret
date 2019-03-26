import { Injectable } from '@angular/core';
import { Module } from '../models/modules/module.class';
import { MainService } from './main.service';
import { ScenarioService } from './scenario.service';

@Injectable()
export class StretchModuleService {

    public OFFSET_WIDTH_BORDER: number = 20;

    public mouseDownEdge: boolean = false;
    public moduleToBeSized: Module = null;
    public moduleHTMLToBeSized: HTMLElement = null;

    public constructor(private mainService: MainService, private scenarioService: ScenarioService) {
    }

    public release(): void {
        if (this.isStretching()) {
            this.scenarioService.generate();
            this.mouseDownEdge = false;
            this.moduleToBeSized = null;
        }
    }

    public doSize(event: MouseEvent): void {
        if (this.isStretching()) {
            const width: number = Math.round(
                this.mainService.getValue(
                    event.x -
                    this.moduleHTMLToBeSized.getBoundingClientRect().left
                )
            );

            // On fait croire au scénario qu'il a cette taille : enlève du calcul inutile sur l'ensemble du scénario a regénérer
            this.moduleToBeSized.duree = width;

            // On lui donne la vraie valeur dans le modèle
            this.moduleToBeSized.setDuration(width);
        }
    }

    public isStretching(): boolean {
        return this.mouseDownEdge && this.moduleToBeSized != null;
    }
}
