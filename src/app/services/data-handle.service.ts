import { Injectable } from '@angular/core';
import { POKEMON_WILDS_V3 } from '../datas/oranageV3/wilds.data';
import { POKEMON_DATA_V3 } from '../datas/oranageV3/pokemon.data';
import { ITEM_DATA_V3 } from '../datas/oranageV3/item.data';
import { BehaviorSubject } from 'rxjs';
import { POKEMON_WILDS_ANOTHER_RED } from '../datas/another_red/wilds.data';
import { POKEMON_DATA_ANOTHER_RED } from '../datas/another_red/pokemon.data';
import { ITEM_DATA_ANOTHER_RED } from '../datas/another_red/item.data';
import { ABILITY_DATA } from '../datas/ability.data';
import { ABILITY_DATA_V3 } from '../datas/oranageV3/ability.data';
import { MART_DATA_V3 } from '../datas/oranageV3/mart.data';
import { MART_DATA_ANOTHER_RED } from '../datas/another_red/mart.data';
import {
  POKEMON_MOVE_TM_V4,
  POKEMON_MOVE_TUTOR_V4,
  POKEMON_MOVE_V4,
} from '../datas/orangeV4/move.data';
import { POKEMON_DATA_V4 } from '../datas/orangeV4/pokemon.data';
import { ABILITY_DATA_V4 } from '../datas/orangeV4/ability.data';

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
      case 'orange_v3':
        return '오렌지 V3';
      case 'orange_v4':
        return '오렌지 V4';
      case 'another_red':
        return '어나더레드';
    }

    return undefined;
  }

  get DBprefix() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return '';
      case 'orange_v4':
        return 'v4';
      case 'another_red':
        return 'another_red_';
    }

    return '';
  }

  get pokemonDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return POKEMON_DATA_V3;
      case 'orange_v4':
        return POKEMON_DATA_V4;
      case 'another_red':
        return POKEMON_DATA_ANOTHER_RED;
    }

    throw new Error('No service support');
  }

  get wildDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return POKEMON_WILDS_V3;
      case 'another_red':
        return POKEMON_WILDS_ANOTHER_RED;
    }

    throw new Error('No service support');
  }

  get itemDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return ITEM_DATA_V3;
      case 'another_red':
        return ITEM_DATA_ANOTHER_RED;
    }

    return [];
  }

  get abilityDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return ABILITY_DATA_V3;
      case 'orange_v4':
        return ABILITY_DATA_V4;
    }
    return ABILITY_DATA;
  }

  get martDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v3':
        return MART_DATA_V3;
      case 'another_red':
        return MART_DATA_ANOTHER_RED;
    }
    return [];
  }

  get moveDatas() {
    switch (this.gameVersionSubject.value) {
      case 'orange_v4':
        return {
          learn: POKEMON_MOVE_V4,
          tm: POKEMON_MOVE_TM_V4,
          tutor: POKEMON_MOVE_TUTOR_V4,
        };
    }
    return undefined;
  }
}
