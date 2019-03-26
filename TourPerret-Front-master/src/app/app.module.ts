import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, PendingChangesGuard } from './app.component';
import { ApiScenarioService } from './services/api/api-scenario.service';
import { PlayerService } from './services/player.service';
import { ScenarioService } from './services/scenario.service';
import { MainService } from './services/main.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { StorageService } from './services/storage.service';
import { FavoritesModulesService } from './services/favorites-modules.service';
import { AppRoutingModule, routableComponents } from './app.routing';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { StretchModuleService } from './services/stretch-module.service';
import { DialogService } from './services/dialog.service';
import { PipeModule } from './pipes/pipe.module';
import { LiveService } from './services/live.service';
import { DragulaModule } from './components/shared/dragula/dragular.module';
import { DisplayModule } from './components/display.module';
import { MaterialModule } from './components/material.module';
import { ScenarioEmptyGuard } from './components/send/send.component';
import { DragulaService } from './components/shared/dragula/dragula.provider';
import { ApiPlanningService } from './services/api/api-planning.service';
import { ApiUserService } from './services/api/api-user.service';
import { ContextMenuService } from 'ngx-contextmenu';
import { MatDialogModule } from '@angular/material';
import { MarkerDialogComponent } from './components/home/editor/timeline/timeline-music/marker-dialog/marker-dialog.component';


@NgModule({
  imports: [
    BrowserModule,
      HttpModule,
      HttpClientModule,
    FormsModule,
    LocalStorageModule.withConfig({
        prefix: 'tour-perret',
        storageType: 'localStorage'
    }),
    DragulaModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DisplayModule,
    PipeModule,
    MaterialModule,
    MatDialogModule,
  ],
  declarations: [
    AppComponent,
      MarkerDialogComponent,
    routableComponents,
  ],
  providers: [
    ApiScenarioService,
    ApiPlanningService,
    ApiUserService,
    PlayerService,
    ScenarioService,
    DragulaService,
    MainService,
    StorageService,
    FavoritesModulesService,
    StretchModuleService,
    PendingChangesGuard, ScenarioEmptyGuard,
    DialogService,
    LiveService,
      ContextMenuService
  ],
    entryComponents: [MarkerDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
