import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  templateUrl: './pokemon-move.component.html',
  styleUrl: './pokemon-move.component.less',
})
export class PokemonMoveComponent implements OnInit {
  private dataHandleService = inject(DataHandleService);
  private pokemonMoveService = inject(PokemonMoveService);
  private moveDetailService = inject(MoveDetailService);
  private dialog = inject(MatDialog);

  @Input() pokemonKeyname!: string;

  moves?: PokemonMoves;
  isRootDrawerOpen = true;
  isDrawerOpen = {
    learn: false,
    tm: false,
    tutor: false,
  };

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

  toggleRootDrawer(event: Event) {
    this.isRootDrawerOpen = !this.isRootDrawerOpen;
    if (this.isRootDrawerOpen) {
      this.scrollToDrawer(event);
    }
  }

  toggleDrawer(event: Event, drawerName: 'learn' | 'tm' | 'tutor'): void {
    this.isDrawerOpen[drawerName] = !this.isDrawerOpen[drawerName];
    if (this.isDrawerOpen[drawerName]) {
      this.scrollToDrawer(event);
    }
  }

  scrollToDrawer(event: Event) {
    setTimeout(() => {
      const element = (event.target as HTMLElement).closest('.drawer-box');
      if (element) {
        const yOffset = -90;
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  }
}
