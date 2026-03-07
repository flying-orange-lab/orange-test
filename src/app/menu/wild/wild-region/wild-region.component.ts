import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Encounter, RegionData } from 'src/app/models/wilds.model';
import { FormControl } from '@angular/forms';
import { HighlightPipe } from 'src/app/shared/highlight.pipe';
import { PokemonCardComponent } from '../../pokedex/pokemon-card/pokemon-card.component';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-wild-region',
  templateUrl: './wild-region.component.html',
  styleUrls: ['./wild-region.component.less'],
  imports: [HighlightPipe, PokemonCardComponent],
})
export class WildRegionComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  @Input() searchContext!: FormControl;
  @Input() regionDatas!: RegionData[];
  @Input() pokemonCatchStatus!: Record<number, boolean>;
  @Output() pokemonCaught = new EventEmitter<{ id: number; status: boolean }>();

  isExpanded = false;
  selectedRegion?: RegionData;
  activeTab: 'encounter' | 'habitat' = 'encounter';

  ngOnInit(): void {
    if (this.regionDatas && this.regionDatas.length > 0) {
      this.selectedRegion = this.regionDatas[0];
    }
  }

  displayName(item: Encounter) {
    let result = item.name;
    if (item.extra) {
      result += ` (${item.extra})`;
    }
    return result;
  }

  get uniquePokemons(): Pokemon[] {
    if (!this.selectedRegion) {
      return [];
    }

    const uniqueNames = new Set<string>();
    const pokemons: Pokemon[] = [];

    for (const areaData of this.selectedRegion.areaDatas) {
      for (const encounter of areaData.encounters) {
        if (!uniqueNames.has(encounter.name)) {
          uniqueNames.add(encounter.name);
          const pokemon = this.pokemonService.findPokemon(encounter.name);
          if (pokemon) {
            pokemons.push(pokemon);
          }
        }
      }
    }

    return pokemons;
  }

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  selectRegion(region: RegionData): void {
    this.selectedRegion = region;
  }

  getPokemonId(pokemonName: string): number {
    const pokemon = this.pokemonService.findPokemon(pokemonName);
    return pokemon?.id ?? 0;
  }

  onCatchPokemon(name: string, status: boolean): void {
    const pokemonId = this.getPokemonId(name);
    if (!pokemonId) {
      return;
    }
    if (status) {
      console.log(`${name} 포켓몬을 잡았습니다.`);
    } else {
      console.log(`바이바이, ${name}`);
    }
    this.pokemonCaught.emit({ id: pokemonId, status: status });
  }
}
