import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MoveLearnData, MoveTutorData } from 'src/app/models/move.model';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { MoveDetailService } from 'src/app/services/move-detail.service';
import { PokemonMoveService } from 'src/app/services/move.service';
import { MoveCardModalComponent } from './move-card-modal/move-card-modal.component';

export interface PokemonMoves {
  learn: MoveLearnData[];
  tm: string[];
  tutor: MoveTutorData[];
}

@Component({
  selector: 'app-pokemon-move',
  imports: [MatTabsModule],
  templateUrl: './pokemon-move.component.html',
  styleUrl: './pokemon-move.component.less',
})
export class PokemonMoveComponent implements OnInit {
  private pokemonMoveService = inject(PokemonMoveService);
  private moveDetailService = inject(MoveDetailService);
  private dialog = inject(MatDialog);

  @Input() pokemonKeyname!: string;

  moves?: PokemonMoves;

  ngOnInit() {
    this.moves = this.pokemonMoveService.getMoveFromPokemonKeyname(
      this.pokemonKeyname,
    );
  }

  openMoveCard(moveName: string) {
    const moveDetail = this.moveDetailService.getMoveDetailByName(moveName);
    if (!moveDetail) return;

    this.dialog.open(MoveCardModalComponent, {
      data: { moveDetail },
      panelClass: 'move-card-modal-panel',
    });
  }
}
