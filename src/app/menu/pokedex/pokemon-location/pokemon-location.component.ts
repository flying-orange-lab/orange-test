import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { PokemonLocation } from 'src/app/models/wilds.model';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-location',
  templateUrl: './pokemon-location.component.html',
  styleUrls: ['./pokemon-location.component.less'],
})
export class PokemonLocationComponent implements OnChanges {
  private dataHandleService = inject(DataHandleService);
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  @Input() pokemonName = '';
  @Input() pokemonExtra? = '';

  pokemonLocations: PokemonLocation[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // pokemonName 입력 값이 변경될 때마다 위치 정보를 다시 조회합니다.
    if (
      this.pokemonName &&
      (changes['pokemonName'] || changes['pokemonExtra'])
    ) {
      this.searchLocations();
    }
  }

  private searchLocations(): void {
    // 서비스의 findPokemonLocations 메서드를 직접 호출하여 데이터를 가져옵니다.
    let extra_term = this.pokemonExtra;
    if (
      [
        '암멍이',
        '체리꼬',
        '일레즌',
        '스트린더',
        '플라엣테',
        '플라제스',
      ].includes(this.pokemonName)
    ) {
      extra_term = undefined;
    }
    this.pokemonLocations = this.pokemonService.findPokemonLocations(
      this.pokemonName,
      extra_term,
    );
  }

  getLocationName(loc: any) {
    let locationName = loc.region;
    if (loc.condition && loc.condition !== '기본') {
      locationName += ` - ${loc.condition}`;
    }
    return locationName;
  }

  clickExtraEvent() {
    const gameVersion = this.dataHandleService.getGameVersion();
    this.router.navigate([gameVersion, 'wild'], {
      state: {
        searchKeyword: this.pokemonName,
      },
    });
  }
}
