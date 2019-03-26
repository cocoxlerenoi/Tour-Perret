import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Module } from '../models/modules/module.class';
import { ModuleJson } from '../models/json/module-json.class';

@Injectable()
export class FavoritesModulesService {

    private data: BehaviorSubject<Module[]> = new BehaviorSubject([]);

    public constructor(private storageService: StorageService) {
        const favoritesModules: Module[] = [];

        for (const moduleFavoriteJson of this.storageService.getFavoritesModules()) {
            const module: Module = Module.convertModuleJsonToModule(moduleFavoriteJson);
            module.original = false;
            module.editable = false;

            favoritesModules.push(module);
        }

        this.data.next(favoritesModules);
    }

    public getFavoritesModules(): Observable<Module[]> {
        return this.data.asObservable();
    }

    public addModuleToFavorites(module: Module, addArray: boolean = false): void {
        const moduleCopy: Module = module.getClone();
        moduleCopy.original = false;
        moduleCopy.editable = false;

        // pas besoin de l'ajouter au tableau si dragula car il fait déjà (désactivé)
        if (addArray) { // on passe toujours du coup vu qu'on ajoute par le "coeur" sur le module
            const favoritesModules: Module[] = this.data.getValue();
            favoritesModules.push(moduleCopy);
            this.data.next(favoritesModules);
        }

        const favoritesModulesJson: ModuleJson[] = [];
        for (const favoriteModule of this.data.getValue()) {
            favoritesModulesJson.push(favoriteModule.getJSONToSave());
        }

        this.storageService.saveFavoritesModules(favoritesModulesJson);
    }

    public removeModuleFromFavorites(which: number): void {
        const favoritesModules: Module[] = this.data.getValue();
        favoritesModules.splice(which, 1);

        this.data.next(favoritesModules);

        const favoritesModulesJson: ModuleJson[] = this.storageService.getFavoritesModules();
        favoritesModulesJson.splice(which, 1);

        this.storageService.saveFavoritesModules(favoritesModulesJson);
    }
}
