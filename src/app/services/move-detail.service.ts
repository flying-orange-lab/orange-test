import { inject, Injectable } from '@angular/core';
import { DataHandleService } from './data-handle.service';
import { MoveDetail } from '../models/move-detail.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoveDetailService {
  private dataHandleService = inject(DataHandleService);
  moveNames: string[] = [];

  constructor() {
    this.dataHandleService.gameVersion$.subscribe(() => {
      const details = this.dataHandleService.moveDetailDatas || [];
      this.moveNames = details.map((m) => m.name);
    });
  }

  getAllMoveDetail(): Observable<MoveDetail[]> {
    return of(this.dataHandleService.moveDetailDatas);
  }

  getMoveDetailByName(name: string): MoveDetail | undefined {
    if (name.startsWith('TM')) {
      name = name.split(' ')[1];
    }

    return this.dataHandleService.moveDetailDatas?.find((m) => m.name === name);
  }
}
