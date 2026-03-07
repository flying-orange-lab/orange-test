import { Injectable, inject } from '@angular/core';
import { DataHandleService } from './data-handle.service';
@Injectable({
  providedIn: 'root',
})
export class PokemonMoveService {
  private dataHandleService = inject(DataHandleService);

  getMoveFromPokemonKeyname(pokemonKeyname: string) {
    const moveDatas = this.dataHandleService.moveDatas;
    if (!moveDatas) {
      return {
        learn: [],
        tm: [],
        tutor: [],
      };
    }

    // 포켓몬의 기본 keyname
    const base_pokemonKeyname = pokemonKeyname.split('-')[0] + '-0';

    let current_move_learn = moveDatas.learn?.[pokemonKeyname] ?? [];
    if (current_move_learn.length === 0) {
      current_move_learn = moveDatas.learn?.[base_pokemonKeyname] ?? [];
    }

    let current_move_tm = moveDatas.tm?.[pokemonKeyname] ?? [];
    if (current_move_tm.length === 0) {
      current_move_tm = moveDatas.tm?.[base_pokemonKeyname] ?? [];
    }

    let current_move_tutor = moveDatas.tutor?.[pokemonKeyname] ?? [];
    if (current_move_tutor.length === 0) {
      current_move_tutor = moveDatas.tutor?.[base_pokemonKeyname] ?? [];
    }

    console.log(pokemonKeyname);
    console.log(base_pokemonKeyname);
    console.log(current_move_learn);
    console.log(current_move_tm);
    console.log(current_move_tutor);

    return {
      learn: current_move_learn,
      tm: current_move_tm,
      tutor: current_move_tutor,
    };
  }
}
