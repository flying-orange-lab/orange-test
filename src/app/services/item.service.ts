import { inject, Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DataHandleService } from './data-handle.service';

export interface TakenItem {
  locationIndex: number;
  itemIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService extends Dexie {
  private dataHandleService = inject(DataHandleService);
  private _initPromise?: Promise<void>;
  takenItems!: Dexie.Table<TakenItem, [number, number]>;

  constructor() {
    super('ItemDB');
    this.version(2)
      .stores({
        takenItems: '[locationIndex+itemIndex]',
        another_red_takenItems: '[locationIndex+itemIndex]',
        alternative_takenItems: '[locationIndex+itemIndex]',
      })
      .upgrade(async (tx) => {
        const storeNames = [
          'takenItems',
          'another_red_takenItems',
          'alternative_takenItems',
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
        this.takenItems = this.table(`${prefix}takenItems`);
        await this.open();
      })();
    }
    return this._initPromise;
  }

  /**
   * 아이템이 획득되었는지 확인
   */
  async isItemTaken(
    locationIndex: number,
    itemIndex: number,
  ): Promise<boolean> {
    const item = await this.takenItems.get([locationIndex, itemIndex]);
    return !!item;
  }

  /**
   * 아이템 획득 상태를 토글
   */
  async toggleItemTaken(
    locationIndex: number,
    itemIndex: number,
  ): Promise<void> {
    const isTaken = await this.isItemTaken(locationIndex, itemIndex);

    if (isTaken) {
      await this.takenItems.delete([locationIndex, itemIndex]);
    } else {
      await this.takenItems.put({ locationIndex, itemIndex });
    }
  }
}
