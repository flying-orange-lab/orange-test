import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE_DISPLAY_DATA, TYPE_LABEL } from 'src/app/datas/type.data';

@Component({
  selector: 'app-pokedex-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokedex-search.component.html',
  styleUrl: './pokedex-search.component.less',
})
export class PokedexSearchComponent implements OnInit {
  pokemonSearchInput = '';
  selectedType: string | null = null;
  pokemonSearchOffset = 1;

  typeLabels = TYPE_LABEL;
  typeDisplay = TYPE_DISPLAY_DATA;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.pokemonSearchInput = params['search'] || '';
      this.pokemonSearchOffset = parseInt(params['gte']) || 1;
      this.selectedType = params['type'] || null;
    });
  }

  onSearchButtonClick(): void {
    if (this.pokemonSearchInput.length === 0) {
      return;
    }

    const isNumericString = /^\d+$/.test(this.pokemonSearchInput);
    if (isNumericString) {
      this.pokemonSearchOffset = parseInt(this.pokemonSearchInput);
      this.pokemonSearchInput = '';
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: undefined, gte: this.pokemonSearchOffset },
        queryParamsHandling: 'merge',
      });
    } else {
      this.pokemonSearchOffset = 1;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: this.pokemonSearchInput, gte: 1 },
        queryParamsHandling: 'merge',
      });
    }
  }

  resetSearch(): void {
    this.pokemonSearchInput = '';
    this.selectedType = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
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
}
