import { Component } from '@angular/core';
import { User } from '../../../models/user.class';

@Component({
    selector: 'my-signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.scss']
})

export class SignupComponent {

    user: User = new User();

    constructor() { }

    inscription(): void {
        console.log('signup');
    }
}
