import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { TYPE_CODE_DATA } from 'src/app/datas/type.data';
import { MoveDetail } from 'src/app/models/move-detail.model';
import { MoveDetailService } from 'src/app/services/move-detail.service';

@Component({
  selector: 'app-move-detail',
  imports: [FormsModule],
  templateUrl: './move-detail.component.html',
  styleUrl: './move-detail.component.less',
})
export class MoveDetailComponent implements OnInit {
  private moveDetailService = inject(MoveDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryList = [
    '파동',
    '장판',
    '베기',
    '소리',
    '펀치',
    '반동',
    '흡수',
    '턱',
    '킥',
  ];
  noResultsMessage = '';

  moveSearchInput = '';
  activeFilters: Record<string, string[]> = {
    contact: [],
    category: [],
  };

  private allMoveDetail: MoveDetail[] = [];
  searchResults: MoveDetail[] = [];

  ngOnInit(): void {
    combineLatest([
      this.moveDetailService.getAllMoveDetail(),
      this.route.queryParamMap,
    ]).subscribe(([data, params]) => {
      // 1. 서비스 데이터 업데이트
      this.allMoveDetail = data;

      // 2. URL 파라미터 업데이트
      this.moveSearchInput = params.get('search') || '';
      this.activeFilters['contact'] = params.getAll('contact');
      this.activeFilters['category'] = params.getAll('category');

      console.log('필터 변경 감지 및 검색 실행:', this.activeFilters);

      // 3. 검색 실행
      this.performSearch();
    });
  }

  performSearch() {
    const lowerCaseSearchTerm = this.moveSearchInput.toLowerCase().trim();

    let filtered = this.allMoveDetail.filter((moveDetail) => {
      if (lowerCaseSearchTerm.length > 0) {
        if (moveDetail.name.toLowerCase().includes(lowerCaseSearchTerm)) {
          return true;
        }
        return false;
      }
      return true;
    });

    filtered = filtered.filter((moveDetail) => {
      return Object.entries(this.activeFilters).every(([key, values]) => {
        if (values.length === 0) return true;

        return values.some((val) => {
          if (key === 'contact') {
            if (val === '접촉') {
              return moveDetail.makeContact === true;
            }
            if (val === '비접촉') {
              return moveDetail.makeContact === false;
            }
            return false;
          }

          if (key === 'category') {
            return moveDetail.category?.includes(val);
          }
          return false;
        });
      });
    });

    console.log(filtered);

    if (filtered.length === 0) {
      this.noResultsMessage = `'${this.moveSearchInput}'에 대한 검색 결과가 없습니다.`;
      this.searchResults = [];
    } else {
      this.noResultsMessage = '';
      this.searchResults = filtered;
    }
  }

  korToEngTypeMapper(type: string) {
    return TYPE_CODE_DATA[type];
  }

  onSearchButtonClick(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search:
          this.moveSearchInput.length > 0 ? this.moveSearchInput : undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleFilter(key: string, value: string) {
    const currentValues = [...this.activeFilters[key]];
    const index = currentValues.indexOf(value);

    if (index > -1) {
      // 이미 있으면 제거
      currentValues.splice(index, 1);
    } else {
      // 없으면 추가
      currentValues.push(value);
    }

    this.activeFilters[key] = [...currentValues];

    console.log(this.activeFilters);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.activeFilters },
      queryParamsHandling: 'merge',
    });
  }

  isFilterActive(key: string, value: string): boolean {
    return this.activeFilters[key]?.includes(value) || false;
  }
}
