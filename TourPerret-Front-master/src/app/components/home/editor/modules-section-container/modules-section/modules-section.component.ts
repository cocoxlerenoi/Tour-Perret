import { Component, Input, OnInit } from '@angular/core';

import * as SectionsMapping from './sections.mapping';
import { Module } from '../../../../../models/modules/module.class';
import { DragulaService } from '../../../../shared/dragula/dragula.provider';
import { FavoritesModulesService } from '../../../../../services/favorites-modules.service';
import { StretchModuleService } from '../../../../../services/stretch-module.service';

@Component({
    selector: 'my-modules-section',
    templateUrl: './modules-section.component.html',
    styleUrls: ['./modules-section.component.scss']
})
export class ModulesSectionComponent implements OnInit {

    private static stretchModuleService: StretchModuleService;

    @Input() sectionId: number;
    @Input() sectionTitle: string;
    public modules: Module[];

    options: any = {
        copy: function (el, source) {
            return source.className === 'modules-wrapper'; // provient de la liste
        },
        accepts: function(el, target, source, sibling) {
            return (source.className === 'modules-wrapper' && target.className === 'modules-line') // liste à timeline
                // || (target.className === 'modules-wrapper' &&
                //     ModulesSectionComponent.isFavoriteSection(target.id.slice(target.id.lastIndexOf('-') + 1)) &&
                //     source.className === 'modules-line') // timeline à liste favoris
                || (target.className === 'modules-line' && source.className === 'modules-line'); // timeline à timeline
        },
        invalid: function(el, handle) {
            return ModulesSectionComponent.stretchModuleService.mouseDownEdge;
        }
    };

    private static isFavoriteSection(sectionId: number): boolean {
        return sectionId == SectionsMapping.SectionsMapping.length - 1;
    }

    constructor(dragulaService: DragulaService, private favoritesModulesService: FavoritesModulesService,
                stretchModuleService: StretchModuleService) {
        ModulesSectionComponent.stretchModuleService = stretchModuleService; // Pour dragula

        dragulaService.dropModel.subscribe((value) => {
            // value[3] = source        value[2] = target
            if (value[2].className === 'modules-wrapper' && value[3].className === 'modules-line') {
                const module: Module = value[4];

                if (module.editable && module.original) {
                    this.favoritesModulesService.addModuleToFavorites(module);
                }
            }
        });

        dragulaService.drag.subscribe(() => {
            document.getElementsByClassName('mat-sidenav-content')[0].setAttribute('style', 'overflow: hidden');
        });

        dragulaService.dragend.subscribe(() => {
            document.getElementsByClassName('mat-sidenav-content')[0].setAttribute('style', 'overflow: auto');
        });
    }

    ngOnInit() {
        this.modules = SectionsMapping.SectionsMapping[this.sectionId].modules;

        if (ModulesSectionComponent.isFavoriteSection(this.sectionId)) {
            this.favoritesModulesService.getFavoritesModules()
                .subscribe((favoritesModules: Module[]) => this.modules = favoritesModules);
        }
    }
}
