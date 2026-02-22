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

@Component({
  selector: 'app-wild-region',
  templateUrl: './wild-region.component.html',
  styleUrls: ['./wild-region.component.less'],
  imports: [HighlightPipe],
})
export class WildRegionComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  @Input() searchContext!: FormControl;
  @Input() regionDatas!: RegionData[];
  @Input() pokemonCatchStatus!: Record<number, boolean>;
  @Output() pokemonCaught = new EventEmitter<{ id: number; status: boolean }>();

  isExpanded = false;
  selectedRegion?: RegionData;

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

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  selectRegion(region: any): void {
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
