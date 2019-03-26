import { Component, HostListener } from '@angular/core';

import '../style/app.scss';
import { ScenarioService } from './services/scenario.service';

import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

const SENTENCE_WHEN_LEAVE: string = 'Les modifications que vous avez apportées ne seront peut-être pas enregistrées.'; // Phrase de Chrome

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent {

    constructor(private scenarioService: ScenarioService) { }

    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        return this.scenarioService.isEmpty();
    }

    // @HostListener allows us to also guard against browser refresh, close, etc. For IE/Edge
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = SENTENCE_WHEN_LEAVE;
        }
    }
}

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
