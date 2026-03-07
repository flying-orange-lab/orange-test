import {
  Component,
  QueryList,
  ViewChildren,
  OnInit,
  inject,
  ElementRef,
} from '@angular/core';
import { WildRegionComponent } from './wild-region/wild-region.component';
import { PokemonCatchService } from 'src/app/services/pokemon-catch.service';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { ActivatedRoute } from '@angular/router';
import { WildArea } from 'src/app/models/wilds.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WildStateService } from 'src/app/services/wild-state.service';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HighlightPipe } from 'src/app/shared/highlight.pipe';

@Component({
  selector: 'app-wild',
  templateUrl: './wild.component.html',
  styleUrls: ['./wild.component.less'],
  imports: [ReactiveFormsModule, AsyncPipe, WildRegionComponent, HighlightPipe],
})
export class WildComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataHandleService = inject(DataHandleService);
  private pokemonCatchService = inject(PokemonCatchService);
  private wildStateService = inject(WildStateService);

  searchContext = new FormControl('');
  wildData: WildArea[] = [];
  filteredWildData$!: Observable<{ index: number; value: WildArea }[]>;
  pokemonCatchStatus: Record<number, boolean> = {};

  @ViewChildren(WildRegionComponent)
  wildRegionComponents!: QueryList<WildRegionComponent>;

  @ViewChildren(WildRegionComponent, { read: ElementRef })
  private wildRegionRef!: QueryList<ElementRef>;

  constructor() {
    if (history.state.searchKeyword) {
      this.searchContext.patchValue(history.state.searchKeyword);
    }
  }

  ngOnInit(): void {
    this.pokemonCatchService.init();

    const initKeyword = history.state.searchKeyword
      ? history.state.searchKeyword
      : '';

    // 데이터 처리
    this.wildData = this.dataHandleService.wildDatas;

    this.filteredWildData$ = this.searchContext.valueChanges.pipe(
      startWith(initKeyword),
      map((value) => this._filter(value || '')),
    );

    // 모든 포켓몬의 포획 상태를 한 번에 불러옴
    if (this.wildData) {
      this.loadAllPokemonCatchStatus();
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.wildData
      .map((item, idx) => ({ index: idx, value: item }))
      .filter((entry) => {
        if (entry.value.locationName.toLowerCase().includes(filterValue)) {
          return true;
        }

        for (const regionData of entry.value.regionDatas) {
          for (const areaData of regionData.areaDatas) {
            for (const encounter of areaData.encounters) {
              if (encounter.name.toLowerCase().includes(filterValue)) {
                return true;
              }
            }
          }
        }

        return false;
      });
  }

  async loadAllPokemonCatchStatus(): Promise<void> {
    const allCaughtPokemon =
      await this.pokemonCatchService.pokemonCatch.toArray();
    allCaughtPokemon.forEach((entry) => {
      this.pokemonCatchStatus[entry.id] = entry.isCaught;
    });
  }

  toggleChild(index: number): void {
    // QueryList는 배열처럼 인덱스로 접근 가능합니다.
    const component = this.wildRegionComponents.get(index);
    if (component) {
      component.toggleExpanded();
      this.wildStateService.toggleExpanded(index, component.isExpanded);
      this.scrollToSection(index);
    }
  }

  async handlePokemonCaught(event: {
    id: number;
    status: boolean;
  }): Promise<void> {
    await this.pokemonCatchService.catchPokemon(event.id, event.status);
    this.pokemonCatchStatus[event.id] = event.status;
  }

  scrollToSection(index: number): void {
    const component = this.wildRegionRef.get(index);
    if (component) {
      component.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
