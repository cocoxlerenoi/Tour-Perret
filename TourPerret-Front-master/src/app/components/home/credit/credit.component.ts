import { Component } from '@angular/core';

@Component({
    selector: 'my-credit',
    templateUrl: 'credit.component.html',
    styleUrls: ['credit.component.scss']
})

export class CreditComponent {

    version: string = require('.../../../package.json').version;

    constructor() { }
}
