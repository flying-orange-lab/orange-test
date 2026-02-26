import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { FormsModule } from '@angular/forms';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';
import { DefenseComponent } from '../defense/defense.component';
import { WindowSizeService } from 'src/app/services/window-size.service';
import { PokedexGuideComponent } from './pokedex-guide/pokedex-guide.component';
import { HelperService } from 'src/app/services/helper.service';
import { TYPE_DISPLAY_DATA, TYPE_LABEL } from 'src/app/datas/type.data';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.less'],
  imports: [
    FormsModule,
    PokemonCardComponent,
    DefenseComponent,
    PokedexGuideComponent,
    NgClass,
  ],
})
export class PokedexComponent implements OnInit {
  private windowSizeService = inject(WindowSizeService);
  private helperService = inject(HelperService);
  private dataHandleService = inject(DataHandleService);
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pokemonSearchInput = '';
  pokemonSearchOffset = 1;
  pokemonSearchAttr?: string;

  selectedType: string | null = null;
  typeLabels = TYPE_LABEL;
  typeDisplay = TYPE_DISPLAY_DATA;

  private allPokemon: Pokemon[] = [];
  searchResults: Pokemon[] = [];
  noResultsMessage = '';

  isDefenseOpen = false;
  isHelperOpen = false;

  @ViewChild(DefenseComponent) defenseComponent!: DefenseComponent;

  ngOnInit(): void {
    this.helperService.helperState$.subscribe((isOpened) => {
      this.isHelperOpen = isOpened;
    });

    // 페이지 로딩 시 모든 포켓몬 데이터 가져옴
    this.pokemonService.getAllPokemon().subscribe((data) => {
      this.allPokemon = data;

      // URL 파라미터가 있다면 검색을 실행합니다.
      this.route.queryParams.subscribe((params) => {
        if (params['search']) {
          const searchTerm = params['search'] || '';
          this.pokemonSearchInput = searchTerm;
        } else {
          this.pokemonSearchInput = '';
        }

        if (params['gte']) {
          this.pokemonSearchOffset = parseInt(params['gte']);
        } else {
          this.pokemonSearchOffset = 1;
        }

        if (params['attr']) {
          this.pokemonSearchAttr = params['attr'];
        } else {
          this.pokemonSearchAttr = '';
        }

        if (params['type']) {
          this.selectedType = params['type'];
        } else {
          this.selectedType = null;
        }

        this.performSearch();
      });
    });
  }

  // 검색 버튼 클릭 시 호출될 메서드
  onSearchButtonClick(): void {
    if (this.pokemonSearchInput.length == 0) {
      return;
    }

    const isNumericString = /^\d+$/.test(this.pokemonSearchInput);
    if (isNumericString) {
      this.pokemonSearchOffset = parseInt(this.pokemonSearchInput);
      this.pokemonSearchInput = '';
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { gte: this.pokemonSearchOffset }, // 페이지 번호 쿼리 파라미터 추가
        queryParamsHandling: 'merge',
      });
    } else {
      this.pokemonSearchOffset = 1;
      this.router.navigate([], {
        relativeTo: this.route, // 현재 라우트를 기준으로
        queryParams: { search: this.pokemonSearchInput },
        queryParamsHandling: 'merge',
      });
    }
  }

  resetSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}, // Clear all query params
    });
  }

  onTypeFilterClick(typeKey: string): void {
    if (this.selectedType === typeKey) {
      this.selectedType = null;
    } else {
      this.selectedType = typeKey;
    }

    this.pokemonSearchOffset = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: this.selectedType,
        gte: 1, // 필터가 바뀌면 1페이지로
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageButtonClick(status: boolean): void {
    let number = this.pokemonSearchOffset;
    if (status) {
      number += 30;
    } else {
      number = Math.max(0, number - 30);
    }
    this.pokemonSearchOffset = number;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { gte: number }, // 페이지 번호 쿼리 파라미터 추가
      queryParamsHandling: 'merge', // 기존 파라미터(search) 유지
    });
  }

  onTypesClick(types: string[]) {
    if (this.windowSizeService.width > 760) {
      this.isDefenseOpen = true;
      this.defenseComponent.initSelectType(types);
      return;
    }
    const gameVersion = this.dataHandleService.getGameVersion();
    this.router.navigate([gameVersion, 'defense'], {
      queryParams: { type: types },
    });
  }
  onTypeClose() {
    this.isDefenseOpen = false;
  }

  private attrCheck(
    pokemon: Pokemon,
    attrName: 'evolutionCondition' | 'wildItems' | 'extra',
  ) {
    if (pokemon.form) {
      for (const formData of pokemon.form) {
        console.log(formData);
        if (!formData[attrName]) {
          return false;
        }
      }
    } else if (!pokemon[attrName]) {
      return false;
    }

    return true;
  }

  performSearch(): void {
    const lowerCaseSearchTerm = this.pokemonSearchInput.toLowerCase().trim();

    // 이름 또는 한국어 이름으로 필터링합니다.
    const filtered = this.allPokemon.filter((pokemon) => {
      if (this.selectedType) {
        if (!pokemon.types || !pokemon.types.includes(this.selectedType)) {
          return false;
        }
      }

      if (this.pokemonSearchAttr) {
        if (this.pokemonSearchAttr === 'form' && !pokemon.form) {
          return false;
        }
        if (
          this.pokemonSearchAttr === 'evol' &&
          !this.attrCheck(pokemon, 'evolutionCondition')
        ) {
          return false;
        }
        if (
          this.pokemonSearchAttr === 'wild' &&
          !this.attrCheck(pokemon, 'wildItems')
        ) {
          return false;
        }
        if (
          this.pokemonSearchAttr === 'extra' &&
          !this.attrCheck(pokemon, 'extra')
        ) {
          return false;
        }
      }

      if (lowerCaseSearchTerm.length > 0) {
        if (pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)) {
          return true;
        }

        if (
          pokemon.koreanName &&
          pokemon.koreanName.toLowerCase().includes(lowerCaseSearchTerm)
        ) {
          return true;
        }

        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.noResultsMessage = `'${this.pokemonSearchInput}'에 대한 검색 결과가 없습니다.`;
      this.searchResults = [];
    } else if (filtered.length > 30) {
      this.noResultsMessage = `총 ${filtered.length}개의 결과 중 30개만 표시되었습니다.`;
      this.searchResults = filtered.slice(
        this.pokemonSearchOffset - 1,
        this.pokemonSearchOffset - 1 + 30,
      );
    } else {
      this.noResultsMessage = '';
      this.searchResults = filtered;
    }
  }
}
