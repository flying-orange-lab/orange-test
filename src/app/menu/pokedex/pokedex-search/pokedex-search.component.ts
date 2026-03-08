import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE_DISPLAY_DATA, TYPE_LABEL } from 'src/app/datas/type.data';
import { MoveDetailService } from 'src/app/services/move-detail.service';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pokedex-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './pokedex-search.component.html',
  styleUrl: './pokedex-search.component.less',
})
export class PokedexSearchComponent implements OnInit {
  pokemonSearchInput = '';
  abilitySearchInput = '';
  moveSearchInput = '';
  isAdvancedSearchOpen = false;
  selectedType: string | null = null;
  pokemonSearchOffset = 1;

  get hasAdvancedSearchContent(): boolean {
    return (
      this.abilitySearchInput.trim().length > 0 ||
      this.moveSearchInput.trim().length > 0 ||
      this.selectedType !== null
    );
  }

  typeLabels = TYPE_LABEL;
  typeDisplay = TYPE_DISPLAY_DATA;
  moveNames: string[] = [];
  filteredMoveNames: string[] = [];
  abilityNames: string[] = [];
  filteredAbilityNames: string[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moveDetailService = inject(MoveDetailService);
  private dataHandleService = inject(DataHandleService);

  ngOnInit(): void {
    this.moveNames = this.moveDetailService.moveNames;
    this.dataHandleService.gameVersion$.subscribe(() => {
      const abilities = this.dataHandleService.abilityDatas || [];
      this.abilityNames = abilities.map((a) => a.name);
    });

    this.route.queryParams.subscribe((params) => {
      this.pokemonSearchInput = params['search'] || '';
      this.abilitySearchInput = params['ability'] || '';
      this.moveSearchInput = params['move'] || '';
      this.pokemonSearchOffset = parseInt(params['gte']) || 1;
      this.selectedType = params['type'] || null;

      if (this.abilitySearchInput || this.moveSearchInput) {
        this.isAdvancedSearchOpen = true;
      }
    });
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
    if (!this.isAdvancedSearchOpen) {
      // 닫을 때 값 초기화 할지 물어볼 수도 있지만 보통 유지하거나 지움.
      // 일단 명시적으로 초기화하지 않으면 숨겨진 채로 검색어 적용될 수 있으므로 초기화.
      this.abilitySearchInput = '';
      this.moveSearchInput = '';
    }
  }

  onSearchButtonClick(): void {
    if (
      this.pokemonSearchInput.length === 0 &&
      this.abilitySearchInput.length === 0 &&
      this.moveSearchInput.length === 0
    ) {
      // 모두 비어있으면 전체 검색 (또는 그대로 유지)
    }

    const isNumericString = /^\d+$/.test(this.pokemonSearchInput);

    // 고급 검색이 닫혀있으면 입력값을 없앰
    if (!this.isAdvancedSearchOpen) {
      this.abilitySearchInput = '';
      this.moveSearchInput = '';
    }

    const queryParams: any = {
      search:
        this.pokemonSearchInput.length > 0 && !isNumericString
          ? this.pokemonSearchInput
          : undefined,
      ability:
        this.abilitySearchInput.length > 0
          ? this.abilitySearchInput
          : undefined,
      move: this.moveSearchInput.length > 0 ? this.moveSearchInput : undefined,
    };

    if (isNumericString) {
      this.pokemonSearchOffset = parseInt(this.pokemonSearchInput);
      this.pokemonSearchInput = '';
      queryParams.gte = this.pokemonSearchOffset;
      queryParams.search = undefined;
    } else {
      this.pokemonSearchOffset = 1;
      queryParams.gte = 1;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  resetSearch(): void {
    this.pokemonSearchInput = '';
    this.abilitySearchInput = '';
    this.moveSearchInput = '';
    this.filteredMoveNames = [];
    this.filteredAbilityNames = [];
    this.selectedType = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  onAbilitySearchChange(): void {
    const searchVal = this.abilitySearchInput.trim();
    if (searchVal.length > 0) {
      this.filteredAbilityNames = this.abilityNames.filter((name) =>
        name.includes(searchVal),
      );
    } else {
      this.filteredAbilityNames = [];
    }
  }

  onMoveSearchChange(): void {
    const searchVal = this.moveSearchInput.trim();
    if (searchVal.length > 0) {
      this.filteredMoveNames = this.moveNames.filter((name) =>
        name.includes(searchVal),
      );
    } else {
      this.filteredMoveNames = [];
    }
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
}
