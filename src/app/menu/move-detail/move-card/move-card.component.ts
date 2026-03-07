import { Component, Input } from '@angular/core';
import { MoveDetail } from 'src/app/models/move-detail.model';
import { TYPE_CODE_DATA } from 'src/app/datas/type.data';

@Component({
  selector: 'app-move-card',
  standalone: true,
  imports: [],
  templateUrl: './move-card.component.html',
  styleUrl: './move-card.component.less',
})
export class MoveCardComponent {
  @Input({ required: true }) moveDetail!: MoveDetail;

  korToEngTypeMapper(type: string) {
    return TYPE_CODE_DATA[type];
  }
}
