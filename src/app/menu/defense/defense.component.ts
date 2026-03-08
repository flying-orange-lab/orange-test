import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TYPE_DISPLAY_DATA,
  TYPE_EFFECTIVE_LABEL,
  TYPE_LABEL,
} from 'src/app/datas/type.data';
import { NgClass } from '@angular/common';
import { DefenseService } from 'src/app/services/defense.service';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less'],
  imports: [NgClass],
  providers: [{ provide: DefenseService }],
})
export class DefenseComponent implements OnInit {
  private defenseService = inject(DefenseService);
  private route = inject(ActivatedRoute);

  showInitialMessage = true;

  selectLabel = TYPE_LABEL;
  selectLabelDisplay = TYPE_DISPLAY_DATA;
  resultLabelDisplay = TYPE_EFFECTIVE_LABEL;

  ngOnInit(): void {
    // URL 파라미터가 있다면 검색을 실행합니다.
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        const queryTypes = Array.isArray(params['type'])
          ? params['type']
          : [params['type']];
        this.initSelectType(queryTypes);
      }
    });
  }

  get calculatedResults() {
    return this.defenseService.calculatedResults;
  }

  initSelectType(types: string[]) {
    this.defenseService.clearType();
    for (const typeKey of types) {
      this.defenseService.selectType(typeKey);
    }
    this.defenseService.updateDefense();
  }

  selectType(typeKey: string): void {
    this.defenseService.selectType(typeKey);
    this.defenseService.updateDefense();
  }
  clearType(): void {
    this.defenseService.clearType();
    this.defenseService.updateDefense();
  }

  isSelected(typeKey: string): boolean {
    return this.defenseService.selectedTypes.includes(typeKey);
  }
}
