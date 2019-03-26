import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { Module } from '../../../models/modules/module.class';
import { ScenarioService } from '../../../services/scenario.service';
import { PlayerService } from '../../../services/player.service';

@Component({
    selector: 'my-toolbox',
    templateUrl: './toolbox.component.html',
    styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements OnInit {

    module: Module = null;

    constructor(private mainService: MainService, private scenarioService: ScenarioService,
                private playerService: PlayerService, private changeDetectorRef: ChangeDetectorRef) {
        this.mainService.toolboxOpened.subscribe((value: Module) => {
            this.module = value;
        });
    }

    ngOnInit() { }

    save(): void {
        this.mainService.toolboxOpened.next(null);

        this.playerService.stop(false);
        this.scenarioService.generate();
    }

    trackByFn(index: any, item: any) {
        return index;
    }
}
