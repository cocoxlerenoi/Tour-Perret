import { Component } from '@angular/core';

@Component({
    selector: 'my-help',
    templateUrl: 'help.component.html',
    styleUrls: ['help.component.scss']
})

export class HelpComponent {

    version: string = require('.../../../package.json').version;

    constructor() { }
}
