import { Component, Injectable } from '@angular/core';
import { Utils } from '../../services/utils.class';
import { ApiPlanningService } from '../../services/api/api-planning.service';
import { HttpResponse } from '../../models/http-response.interface';
import { CanActivate, Router } from '@angular/router';
import { ScenarioService } from '../../services/scenario.service';
import { DialogService } from '../../services/dialog.service';
import { ApiScenarioService } from '../../services/api/api-scenario.service';

@Component({
    selector: 'my-send',
    templateUrl: 'send.component.html',
    styleUrls: ['send.component.scss']
})

export class SendComponent {

    minDate: Date;
    maxDate: Date;

    nbOfHours: number[] = [];
    hours: Date[][] = [];
    hourSelected: number = 0;

    constructor(private apiPlanningService: ApiPlanningService, private dialogService: DialogService,
                private scenarioService: ScenarioService, private apiScenarioService: ApiScenarioService,
                private router: Router) {
        const today: Date = new Date();

        this.minDate = Utils.getOnlyDate(today);

        if (today.getHours() == 23) {
            this.minDate.setDate(this.minDate.getDate() + 1);
        }

        this.maxDate = new Date(today);
        this.maxDate.setMonth(this.maxDate.getMonth() + 2);
        this.maxDate.setDate(0);
    }

    dateChanged(date: Date): void {
        this.hours.length = 0;
        this.nbOfHours.length = 0;
        this.hourSelected = 0;

        this.apiPlanningService.getPlanningPeriods(date).subscribe((valuePlanningPeriod: HttpResponse) => {
            for (const period of valuePlanningPeriod.data) {
                const dateToAdd: Date = new Date(period * 1000);

                if (this.hours[dateToAdd.getHours()] == null) {
                    if (this.hourSelected == 0) {
                        this.hourSelected = dateToAdd.getHours();
                    }
                    this.nbOfHours.push(dateToAdd.getHours());
                    this.hours[dateToAdd.getHours()] = [];
                }

                this.hours[dateToAdd.getHours()].push(dateToAdd);
            }
        });
    }

    send(date: Date): void {
        if (!this.scenarioService.isEmpty()) {
            this.dialogService.confirm('Envoyer le scénario', 'Êtes-vous certain de vouloir envoyer votre scénario qui sera joué sur la tour le ' + date.toLocaleString() + ' ?', 'Non', 'Envoyer').subscribe((result) => {
                if (result) {
                    this.apiScenarioService.sendScenario(date)
                        .subscribe((data: HttpResponse) => {
                            this.scenarioService.getScenario().lastSended = new Date().getTime();
                            this.dialogService.toast('Le scénario a bien été envoyé. Il sera joué le ' + new Date(data.data['date']).toLocaleString(), 5000);
                            this.router.navigate(['editeur']);
                        });
                }
            });
        }
    }
}

@Injectable()
export class ScenarioEmptyGuard implements CanActivate {

    constructor(private scenarioService: ScenarioService, private router: Router) { }

    canActivate() {
        return this.checkScenarioEmpty();
    }

    private checkScenarioEmpty(): boolean {
        if (this.scenarioService.isEmpty()) {
            this.router.navigate(['editeur']);

            return false;
        } else {
            return true;
        }
    }
}
