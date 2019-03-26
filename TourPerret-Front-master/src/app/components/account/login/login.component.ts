import { Component } from '@angular/core';
import { User } from '../../../models/user.class';

@Component({
    selector: 'my-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent {

    user: User = new User();

    constructor() { }

    connection(): void {
        console.log('login');
    }
}
