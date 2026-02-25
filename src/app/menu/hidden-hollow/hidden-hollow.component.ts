import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenHollow } from 'src/app/models/hollow.model';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidden-hollow',
  imports: [CommonModule],
  templateUrl: './hidden-hollow.component.html',
  styleUrl: './hidden-hollow.component.less',
})
export class HiddenHollowComponent implements OnInit {
  private dataHandleService = inject(DataHandleService);
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  hollowDatas: HiddenHollow[] = [];

  ngOnInit(): void {
    this.hollowDatas = this.dataHandleService.hiddenHollowDatas;
  }

  getBadgeClass(type: string) {
    switch (type) {
      case '자주':
        return 'bg-common';
      case '간혹':
        return 'bg-uncommon';
      case '가끔':
        return 'bg-rare';
      default:
        return '';
    }
  }

  getPokemonImageUrl(pokemonName: string): string {
    const pokemon = this.pokemonService.findPokemon(pokemonName);
    if (!pokemon) {
      return ''
      // return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/substitute.png";
    }

    let imageUrl = pokemon.imageUrl;
    if (pokemon.form) {
      imageUrl = pokemon.form[0].imageUrl;

      // 특정 포켓몬 처리
      if (pokemonName === "대쓰여너(청)") {
        imageUrl = pokemon.form[1].imageUrl;
      }
    }

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${imageUrl}`;
  }

  onPokemonClick(pokemonName: string): void {
    const gameVersion = this.dataHandleService.getGameVersion();
    this.router.navigate([gameVersion, 'pokedex'], {
      queryParams: { search: this.pokemonService.getBaseName(pokemonName) },
    });
  }

}
