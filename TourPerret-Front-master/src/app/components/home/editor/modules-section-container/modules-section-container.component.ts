import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import * as SectionsMapping from './modules-section/sections.mapping';

@Component({
    selector: 'my-modules-section-container',
    templateUrl: './modules-section-container.component.html',
    styleUrls: ['./modules-section-container.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ height: '0px' }),
                animate('150ms ease', style({ height: '*' }))
            ]),
            transition(':leave', [
                style({ height: '*' }),
                animate('150ms ease', style({ height: '0px' }))
            ]),
        ]),
    ],
})
export class ModulesSectionContainerComponent implements OnInit {

    public sections: SectionsMapping.SectionsMap[];
    opened: boolean = true;

    constructor() {
        this.sections = SectionsMapping.SectionsMapping;
    }

    ngOnInit() {}

    toggle(): void {
        this.opened = !this.opened;
    }
}
