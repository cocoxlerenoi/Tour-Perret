import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ColorPickerModule } from 'ngx-color-picker';
import { MaterialModule } from './material.module';
import { DragulaModule } from './shared/dragula/dragular.module';
import { PipeModule } from '../pipes/pipe.module';
import { ModulesSectionContainerComponent } from './home/editor/modules-section-container/modules-section-container.component';
import { EditorComponent } from './home/editor/editor.component';
import { TimelineComponent } from './home/editor/timeline/timeline.component';
import { PreviewComponent } from './home/preview/preview.component';
import { ModulesSectionComponent } from './home/editor/modules-section-container/modules-section/modules-section.component';
import { ToolboxComponent } from './home/toolbox/toolbox.component';
import { ModuleComponent } from './shared/module/module.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ScenarioInfosComponent } from './shared/scenario-infos/scenario-infos.component';
import { HelpComponent } from './home/help/help.component';
import { AboutComponent } from './home/about/about.component';
import { CreditComponent } from './home/credit/credit.component';
import { CalendarComponent } from './send/calendar/calendar.component';
import { DragulaService } from './shared/dragula/dragula.provider';
import { InputComponent } from './home/toolbox/input/input.component';
import { TimePickerComponent } from './home/toolbox/input/time-picker/time-picker.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import {TimelineMusicComponent} from './home/editor/timeline/timeline-music/timeline-music.component';

@NgModule({
    imports: [
        BrowserModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        DragulaModule,
        ColorPickerModule,
        ContextMenuModule,
        PipeModule,
    ],
    declarations: [
        ModulesSectionContainerComponent,
        EditorComponent,
        PreviewComponent,
        TimelineComponent,
        ToolboxComponent,
        ModulesSectionComponent,
        ModuleComponent,
        InputComponent,
        TimePickerComponent,
        DialogComponent,
        ScenarioInfosComponent,
        HelpComponent,
        AboutComponent,
        CreditComponent,
        CalendarComponent,
        LoginComponent,
        SignupComponent,
        TimelineMusicComponent,
    ],
    exports: [
        ModulesSectionContainerComponent,
        EditorComponent,
        PreviewComponent,
        TimelineComponent,
        ToolboxComponent,
        ModulesSectionComponent,
        ModuleComponent,
        InputComponent,
        TimePickerComponent,
        DialogComponent,
        ScenarioInfosComponent,
        HelpComponent,
        AboutComponent,
        CreditComponent,
        CalendarComponent,
        LoginComponent,
        SignupComponent,
        TimelineMusicComponent,
    ],
    providers: [
        DragulaService,
    ],
    entryComponents: [
        DialogComponent
    ]
})
export class DisplayModule {
    static forRoot() {
        return {
            ngModule: DisplayModule,
            providers: [],
        };
    }
}
