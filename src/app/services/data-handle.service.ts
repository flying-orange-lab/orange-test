import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ABILITY_DATA } from '../datas/ability.data';
import {
  POKEMON_MOVE_TM_V4,
  POKEMON_MOVE_TUTOR_V4,
  POKEMON_MOVE_V4,
} from '../datas/orangeV4/move.data';
import { POKEMON_DATA_V4 } from '../datas/orangeV4/pokemon.data';
import { ABILITY_DATA_V4 } from '../datas/orangeV4/ability.data';
import { POKEMON_WILDS_V4 } from '../datas/orangeV4/wilds.data';
import { POKEMON_MOVE_DETAIL_V4 } from '../datas/orangeV4/move-detail.data';
import { POKEMON_HOLLOW_V4 } from '../datas/orangeV4/hollow.data';
import { ITEM_DATA_V4 } from '../datas/orangeV4/item.data';
import { MART_DATA_V4 } from '../datas/orangeV4/mart.data';
import { POKEMON_GOTCHA_V4 } from '../datas/orangeV4/gotcha.data';

@Injectable({
  providedIn: 'root',
})
export class DataHandleService {
  private gameVersionSubject = new BehaviorSubject<string | null>(null);
  gameVersion$ = this.gameVersionSubject.asObservable();

  setGameVersion(version: string) {
    this.gameVersionSubject.next(version);
  }

  getGameVersion(): string | null {
    return this.gameVersionSubject.value;
  }

  get gameTitle() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return '얼터너티브 블랙2';
    }

    return undefined;
  }

  get DBprefix() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return 'alternative_';
    }

    return '';
  }

  get pokemonDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return POKEMON_DATA_V4;
    }

    throw new Error('No service support');
  }

  get wildDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return POKEMON_WILDS_V4;
    }

    throw new Error('No service support');
  }

  get gotchaDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return POKEMON_GOTCHA_V4;
    }

    return [];
  }

  get itemDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return ITEM_DATA_V4;
    }

    return [];
  }

  get abilityDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return ABILITY_DATA_V4;
    }
    return ABILITY_DATA;
  }

  get martDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return MART_DATA_V4;
    }
    return [];
  }

  get moveDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return {
          learn: POKEMON_MOVE_V4,
          tm: POKEMON_MOVE_TM_V4,
          tutor: POKEMON_MOVE_TUTOR_V4,
        };
    }
    return undefined;
  }

  get moveDetailDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return POKEMON_MOVE_DETAIL_V4;
    }
    return [];
  }

  get hiddenHollowDatas() {
    switch (this.gameVersionSubject.value) {
      case 'alternative':
        return POKEMON_HOLLOW_V4;
    }
    return [];
  }
}
