import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { ScenarioEmptyGuard, SendComponent } from './components/send/send.component';
import { PendingChangesGuard } from './app.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
    { path: 'editeur', component: HomeComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'envoie', canActivate: [ScenarioEmptyGuard], component: SendComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'connexion', component: AccountComponent, canDeactivate: [PendingChangesGuard] },
    { path: '', redirectTo: 'editeur', pathMatch: 'full'},
    { path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }

export const routableComponents = [
    HomeComponent,
    SendComponent,
    AccountComponent
];
