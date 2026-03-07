import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MoveDetail } from 'src/app/models/move-detail.model';
import { MoveCardComponent } from 'src/app/menu/move-detail/move-card/move-card.component';

interface MoveCardModalData {
  moveDetail: MoveDetail;
}

@Component({
  selector: 'app-move-card-modal',
  standalone: true,
  imports: [MoveCardComponent],
  templateUrl: './move-card-modal.component.html',
  styleUrl: './move-card-modal.component.less',
})
export class MoveCardModalComponent {
  private dialogRef = inject(MatDialogRef<MoveCardModalComponent>);
  public data: MoveCardModalData = inject(MAT_DIALOG_DATA);

  close() {
    this.dialogRef.close();
  }
}
