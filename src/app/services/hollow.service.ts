import { inject, Injectable } from '@angular/core';
import { DataHandleService } from './data-handle.service';
import { Observable, of } from 'rxjs';
import { HiddenHollow } from '../models/hollow.model';

@Injectable({
  providedIn: 'root',
})
export class MoveDetailService {
  private dataHandleService = inject(DataHandleService);

  getHiddenHollow(): Observable<HiddenHollow[]> {
    return of(this.dataHandleService.hiddenHollowDatas);
  }
}
