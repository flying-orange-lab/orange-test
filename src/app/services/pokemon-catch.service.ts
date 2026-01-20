import { inject, Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DataHandleService } from './data-handle.service';

interface Catch {
  id: number;
  isCaught: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonCatchService extends Dexie {
  private dataHandleService = inject(DataHandleService);
  private _initPromise?: Promise<void>;
  pokemonCatch!: Dexie.Table<Catch, number>;

  constructor() {
    super('PokemonCatchDB');

    this.version(2)
      .stores({
        gotcha: 'id',
        another_red_gotcha: 'id',
        alternative_gotcha: 'id',
      })
      .upgrade(async (tx) => {
        const storeNames = [
          'gotcha',
          'another_red_gotcha',
          'alternative_gotcha',
        ];

        for (const storeName of storeNames) {
          const oldGotchaData = await tx.table(storeName).toArray();
          for (const row of oldGotchaData) {
            await tx.table(storeName).put(row);
          }
        }
      });
  }

  async init() {
    if (!this._initPromise) {
      this._initPromise = (async () => {
        const prefix = this.dataHandleService.DBprefix;
        this.pokemonCatch = this.table(`${prefix}gotcha`);
        await this.open();
      })();
    }
    return this._initPromise;
  }

  async catchPokemon(id: number, status: boolean) {
    this.pokemonCatch.put({ id: id, isCaught: status });
  }
}
