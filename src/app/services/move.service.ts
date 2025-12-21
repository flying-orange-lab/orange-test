import { Injectable, inject } from '@angular/core';
import { DataHandleService } from './data-handle.service';
@Injectable({
  providedIn: 'root',
})
export class PokemonMoveService {
  private dataHandleService = inject(DataHandleService);

  getMoveFromPokemonKeyname(pokemonKeyname: string) {
    const moveDatas = this.dataHandleService.moveDatas;
    return {
      learn: moveDatas?.learn?.[pokemonKeyname] ?? [],
      tm: moveDatas?.tm?.[pokemonKeyname] ?? [],
      tutor: moveDatas?.tutor?.[pokemonKeyname] ?? [],
    };
  }
}
