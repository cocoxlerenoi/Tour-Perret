import { AfterViewChecked, Component, ElementRef, HostListener, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Module } from '../../../models/modules/module.class';
import { MainService } from '../../../services/main.service';
import { PlayerService } from '../../../services/player.service';
import { FavoritesModulesService } from '../../../services/favorites-modules.service';
import { StretchModuleService } from '../../../services/stretch-module.service';
import { ScenarioService } from '../../../services/scenario.service';
import { DialogService } from '../../../services/dialog.service';
import { Utils } from '../../../services/utils.class';

@Component({
    selector: 'my-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss']
})

export class ModuleComponent implements AfterViewChecked {

    @Input() module: Module;
    @Input() indexInSection: number;
    readonly widthNotEditable: number = 150;

    constructor(public mainService: MainService, public playerService: PlayerService,
                public favoritesModulesService: FavoritesModulesService,
                public stretchModuleService: StretchModuleService,
                public elRef: ElementRef, public scenarioService: ScenarioService,
                public dialogService: DialogService, public sanitizer: DomSanitizer) {
    }

    openToolbox(): void {
        if (this.module.editable) {
            this.mainService.toolboxOpened.next(this.module);
        }
    }

    cloneModuleToEtage(): void {
        this.module.cloneInScene();
    }

    addModuleToEtage(etage: number): void {
        const module: Module = Utils.clone(this.module, false);
        module.editable = true;

        this.scenarioService.getScenario().scenes[etage].addModule(module);
    }

    deleteModuleFromScenario(): void {
        this.playerService.stop(false);

        this.dialogService.confirm('Supprimer l\'effet ?', 'Êtes-vous certain de vouloir supprimer cet effet ?', 'Non', 'Supprimer').subscribe((value) => {
           if (value) {
               if (this.mainService.getCurrentModuleToolbox() == this.module) {
                   this.mainService.toolboxOpened.next(null);
               }

               this.module.delete();
           }
        });
    }

    deleteModuleFromFavorites(): void {
        this.dialogService.confirm('Supprimer l\'effet ?', 'Êtes-vous certain de vouloir supprimer cet effet de vos favoris ?', 'Non', 'Supprimer').subscribe((value) => {
            if (value) {
                this.favoritesModulesService.removeModuleFromFavorites(this.indexInSection);
            }
        });
    }

    addModuleToFavorites(): void {
        this.favoritesModulesService.addModuleToFavorites(this.module, true);
    }

    copy(): void {
        this.mainService.setModuleSaved(this.module);
    }

    cut(): void {
        this.mainService.setModuleSaved(this.module);
        this.module.delete();
    }

    paste(): void {
        this.module.scene.addModule(this.mainService.getModuleSaved(), this.module.posInScene + 1);
    }

    pasteLine(): void {
        const etage: Module[] = this.mainService.getEtageSaved();

        for (const moduleI in etage) {
            this.module.scene.addModule(etage[moduleI], this.module.posInScene + 1 + +moduleI);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event: MouseEvent) {
        this.playerService.stop(false);
        if (this.module.editable) {
            this.stretchModuleService.mouseDownEdge = this.isInEdge(event);

            if (this.stretchModuleService.mouseDownEdge) {
                this.stretchModuleService.moduleToBeSized = this.module;
                this.stretchModuleService.moduleHTMLToBeSized = this.elRef.nativeElement;
            }
        } else {
            this.deselectSized(event);
        }
    }

    @HostListener('mouseup', ['$event'])
    onMouseup(event: MouseEvent) {
        this.stretchModuleService.release();
        this.deselectSized(event);
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.module.editable) {
            if (this.stretchModuleService.mouseDownEdge || this.isInEdge(event)) {
                this.elRef.nativeElement.style.cursor = 'col-resize';
            } else {
                this.deselectSized(event);
            }
        } else {
            this.elRef.nativeElement.style.cursor = 'move';
        }
    }

    private isInEdge(event: MouseEvent): boolean {
        if (this.module.editable) {
            const rightMajor: number = this.elRef.nativeElement.getBoundingClientRect().right;
            const right: number = rightMajor - this.stretchModuleService.OFFSET_WIDTH_BORDER;
            const bottomCloneButton: number = this.elRef.nativeElement.querySelector('.clone').getBoundingClientRect().bottom;
            const mouseX: number = event.x;
            const mouseY: number = event.y;

            return mouseX >= right && mouseX <= rightMajor && mouseY > bottomCloneButton;
        } else {
            return false;
        }
    }

    private deselectSized(event: MouseEvent): void {
        this.stretchModuleService.mouseDownEdge = false;
        if (!this.isInEdge(event)) {
            this.elRef.nativeElement.style.cursor = 'auto';
        }
        this.stretchModuleService.moduleToBeSized = null;
        this.stretchModuleService.moduleHTMLToBeSized = null;
    }

    ngAfterViewChecked() {
        try {
            this.elRef.nativeElement.querySelector('.open-toolbox').setAttribute('style', 'width: ' +
                (this.elRef.nativeElement.getBoundingClientRect().width - this.stretchModuleService.OFFSET_WIDTH_BORDER) + 'px');
        } catch (e) {}
    }
}
