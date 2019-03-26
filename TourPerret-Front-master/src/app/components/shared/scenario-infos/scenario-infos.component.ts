import { Component, Input } from '@angular/core';
import { Scenario } from '../../../models/scenario.class';
import { ScenarioService } from '../../../services/scenario.service';

@Component({
    selector: 'my-scenario-infos',
    templateUrl: 'scenario-infos.component.html',
    styleUrls: ['scenario-infos.component.scss']
})

export class ScenarioInfosComponent {

    scenario: Scenario;

    @Input() saveReminder: boolean = true;

    constructor(scenarioService: ScenarioService) {
        this.scenario = scenarioService.getScenario();
    }
}
