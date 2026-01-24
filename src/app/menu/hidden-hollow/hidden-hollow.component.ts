import { Component, inject, OnInit } from '@angular/core';
import { HiddenHollow } from 'src/app/models/hollow.model';
import { DataHandleService } from 'src/app/services/data-handle.service';

@Component({
  selector: 'app-hidden-hollow',
  imports: [],
  templateUrl: './hidden-hollow.component.html',
  styleUrl: './hidden-hollow.component.less',
})
export class HiddenHollowComponent implements OnInit {
  private dataHandleService = inject(DataHandleService);
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
}
