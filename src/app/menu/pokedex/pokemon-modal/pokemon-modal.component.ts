import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokemonMoveComponent } from '../pokemon-move/pokemon-move.component';

interface ModelData {
  currentMoveKeyName: string;
}

@Component({
  selector: 'app-pokemon-modal',
  imports: [MatTabsModule, PokemonMoveComponent],
  templateUrl: './pokemon-modal.component.html',
  styleUrl: './pokemon-modal.component.less',
})
export class PokemonModalComponent {
  private dialogRef = inject(MatDialogRef<PokemonModalComponent>);

  public data: ModelData = inject(MAT_DIALOG_DATA);

  close() {
    this.dialogRef.close();
  }
}
