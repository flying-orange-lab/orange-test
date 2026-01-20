import { inject, Injectable } from '@angular/core';
import { DataHandleService } from './data-handle.service';
import { MoveDetail } from '../models/move-detail.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoveDetailService {
  private dataHandleService = inject(DataHandleService);

  getAllMoveDetail(): Observable<MoveDetail[]> {
    return of(this.dataHandleService.moveDetailDatas);
  }
}
