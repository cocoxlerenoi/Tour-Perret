import { Injectable } from '@angular/core';
import { Module } from '../models/modules/module.class';
import { BehaviorSubject } from 'rxjs';
import { ScenarioService } from './scenario.service';
import { Scenario } from '../models/scenario.class';
import { User } from '../models/user.class';
import { Http } from '@angular/http';

@Injectable()
export class MainService {

    public toolboxOpened: BehaviorSubject<Module> = new BehaviorSubject<Module>(null);
    public zoom: number = 5;
    public isPi: boolean = true;

    private moduleSaved: Module = null;
    private etageSaved: Module[] = null;

    private maxBrowserWidth: number = 0;

    public user: User = null;

    constructor(private scenarioService: ScenarioService, http: Http) {
        // http.get('http://192.168.0.1/pi.txt')
        //     .subscribe((value: Response) => this.isPi = value.json());
    }

    public getWidth(duree: number): number {
        return duree / Math.exp(this.zoom / 2);
    }

    public getValue(width: number): number {
        return width * Math.exp(this.zoom / 2);
    }

    public getSizeLine(): number {
        // const sizeFromScenarioDuration = this.getWidth(this.scenarioService.getScenario().dureeTotale);
        //
        // if (window.innerWidth > this.maxBrowserWidth) {
        //     this.maxBrowserWidth = window.innerWidth;
        // }
        //
        // return (sizeFromScenarioDuration * 2) + (this.maxBrowserWidth * 3);

        return this.getWidth(Scenario.MAX_SCENARIO_MINUTES * 1000 * 60);
    }



    public getCurrentModuleToolbox(): Module {
        return this.toolboxOpened.getValue();
    }


    /*
        Copier/Couper/Coller
     */
    public getModuleSaved(): Module {
        return this.moduleSaved.getClone();
    }

    public setModuleSaved(module: Module): void {
        this.moduleSaved = module.getClone();
    }

    public hasModuleSaved(): boolean {
        return this.moduleSaved != null;
    }

    public getEtageSaved(): Module[] {
        const etageCloned: Module[] = [];

        for (const module of this.etageSaved) {
            etageCloned.push(module.getClone());
        }

        return etageCloned;
    }

    public setEtageSaved(etage: Module[]): void {
        if (etage.length > 0) {
            this.etageSaved = [];

            for (const module of etage) {
                this.etageSaved.push(module.getClone());
            }
        }
    }

    public hasEtageSaved(): boolean {
        return this.etageSaved != null && this.etageSaved.length > 0;
    }
}
