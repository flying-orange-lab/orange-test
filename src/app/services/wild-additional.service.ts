import { inject, Injectable } from '@angular/core';
import { DataHandleService } from './data-handle.service';

@Injectable({
  providedIn: 'root',
})
export class WildAdditionalService {
  private dataHandleService = inject(DataHandleService);

  private pokemonLocationMap = new Map<string, string[]>();

  constructor() {
    this.dataHandleService.gameVersion$.subscribe(() => {
      this.updateLocationMap();
      console.log(this.pokemonLocationMap);
    });
  }

  private updateLocationMap() {
    this.pokemonLocationMap.clear();
    const datas = this.dataHandleService.wildAdditionalDatas;
    for (const category of datas) {
      for (const data of category.data) {
        if (!this.pokemonLocationMap.has(data.name)) {
          this.pokemonLocationMap.set(data.name, []);
        }
        if (data.location) {
          this.pokemonLocationMap.get(data.name)!.push(data.location);
        }
      }
    }
  }

  get wildAdditionalDatas() {
    return this.dataHandleService.wildAdditionalDatas;
  }

  getLocationsByName(name: string): string[] | undefined {
    return this.pokemonLocationMap.get(name);
  }
}
