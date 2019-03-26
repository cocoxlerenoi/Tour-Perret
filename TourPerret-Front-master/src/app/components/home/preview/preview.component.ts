import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { ScenarioService } from '../../../services/scenario.service';

@Component({
  selector: 'my-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @ViewChild('canvasEtage3') canvasEtage3: any;
  @ViewChild('canvasEtage2') canvasEtage2: any;
  @ViewChild('canvasEtage1') canvasEtage1: any;

  constructor(public playerService: PlayerService, public scenarioService: ScenarioService) {
  }

  ngOnInit() {
    this.playerService.setCanvas(this.canvasEtage3, this.canvasEtage2, this.canvasEtage1);
  }

  getProgressBarValue(): number {
      if (this.scenarioService.isEmpty()) {
        return 0;
      } else {
          return this.playerService.getTimer() * 100 / this.scenarioService.getScenario().dureeTotale;
      }
  }

}
