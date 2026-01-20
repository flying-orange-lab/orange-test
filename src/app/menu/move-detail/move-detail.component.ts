import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE_CODE_DATA } from 'src/app/datas/type.data';
import { MoveDetail } from 'src/app/models/move-detail.model';
import { MoveDetailService } from 'src/app/services/move-detail.service';

@Component({
  selector: 'app-move-detail',
  imports: [],
  templateUrl: './move-detail.component.html',
  styleUrl: './move-detail.component.less',
})
export class MoveDetailComponent implements OnInit {
  private moveDetailService = inject(MoveDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  moveSearchInput = '';
  noResultsMessage = '';

  private allMoveDetail: MoveDetail[] = [];
  searchResults: MoveDetail[] = [];

  ngOnInit(): void {
    this.moveDetailService.getAllMoveDetail().subscribe((data) => {
      this.allMoveDetail = data;

      this.route.queryParams.subscribe((params) => {
        this.performSearch();
      });
    });
  }
  performSearch() {
    const lowerCaseSearchTerm = this.moveSearchInput.toLowerCase().trim();

    const filtered = this.allMoveDetail.filter((moveDetail) => {
      if (lowerCaseSearchTerm.length > 0) {
        if (moveDetail.name.toLowerCase().includes(lowerCaseSearchTerm)) {
          return true;
        }
        return false;
      }
      return true;
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
}
