import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { PokemonLocation } from '../models/wilds.model';
import { TYPE_DISPLAY_DATA } from '../datas/type.data';
import { DataHandleService } from './data-handle.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private dataHandleService = inject(DataHandleService);

  newPokemonIds = new Set([
    21, 22, 43, 44, 45, 48, 49, 54, 55, 61, 66, 67, 68, 69, 70, 71, 84, 85, 86,
    87, 108, 115, 128, 167, 168, 172, 173, 174, 185, 190, 199, 201, 208, 219,
    223, 224, 226, 227, 236, 237, 243, 244, 245, 261, 262, 263, 283, 284, 298,
    299, 300, 307, 308, 309, 310, 335, 336, 351, 399, 400, 403, 404, 405, 424,
    431, 432, 433, 434, 435, 509, 510, 555, 557, 558, 580, 581, 585, 586, 618,
    621, 622, 623,
  ]);

  filterExtra = [
    '대쓰여너',
    '안농',
    '플라베베',
    '도롱충이',
    '시비꼬',
    '배쓰나이',
    '깝질무',
    '트리토돈',
    '싸리용',
    '춤추새',
    '야도란',
    '야도킹',
    '야돈',
    '루가루암',
  ];

  getBaseName(pokemonName: string): string {
    // 폼 이름이 있는 포켓몬 처리

    for (const extraName of this.filterExtra) {
      if (pokemonName.startsWith(extraName)) {
        return extraName;
      }
    }

    return pokemonName;
  }

  getAllPokemon(): Observable<Pokemon[]> {
    return of(this.dataHandleService.pokemonDatas);
  }

  findPokemon(pokemonName: string) {
    const baseName = this.getBaseName(pokemonName);
    return this.dataHandleService.pokemonDatas.find(
      (pokemon: Pokemon) => pokemon.koreanName === baseName,
    );
  }

  findPokemonLocations(pokemonName: string, extra?: string) {
    const locations: PokemonLocation[] = [];

    const lowerCasePokemonName = pokemonName.toLowerCase();
    const uniqueLocations = new Set<string>();

    for (const locationData of this.dataHandleService.wildDatas) {
      const locationName = locationData['locationName'];
      const regionDatas = locationData['regionDatas'];

      for (const regionData of regionDatas) {
        const locationStatus = regionData['locationStatus'];
        const areaDatas = regionData['areaDatas'];

        const allEncounters = areaDatas.flatMap((areaInfo) =>
          areaInfo.encounters.map((encounter) => ({
            ...encounter,
            area: areaInfo.area,
            region: locationName,
            condition: locationStatus,
          })),
        );

        for (const encounter of allEncounters) {
          const baseName = this.getBaseName(encounter.name);

          if (baseName.toLowerCase() !== lowerCasePokemonName) {
            continue;
          }
          if (extra && extra !== '일반') {
            if (encounter.extra !== extra) {
              continue;
            }
          }

          const locationKey = `${locationName}|${locationStatus}|${encounter.area}`;

          if (!uniqueLocations.has(locationKey)) {
            uniqueLocations.add(locationKey);

            const isDefaultCondition = Object.keys(regionData).length === 1;
            locations.push({
              region: locationName,
              condition: isDefaultCondition ? '' : locationStatus,
              area: encounter.area,
              minLv: encounter.minLv,
              maxLv: encounter.maxLv,
              rate: encounter.rate,
            });
          }
        }
      }
    }

    return locations;
  }

  findAbility(abilityName: string) {
    return this.dataHandleService.abilityDatas.find(
      (ability) => ability.name == abilityName,
    );
  }

  engToKorTypeMapper(type: string) {
    return TYPE_DISPLAY_DATA[type];
  }
}
