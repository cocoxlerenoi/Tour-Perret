import { Component } from '@angular/core';

@Component({
    selector: 'my-about',
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss']
})

export class AboutComponent {

    version: string = require('.../../../package.json').version;

    constructor() { }
}
