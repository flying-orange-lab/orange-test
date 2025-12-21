import { Component, inject, Input, OnInit } from '@angular/core';
import { MoveLearnData, MoveTutorData } from 'src/app/models/move.model';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { PokemonMoveService } from 'src/app/services/move.service';

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

  @Input() pokemonKeyname!: string;

  moves?: PokemonMoves;
  isRootDrawerOpen = false;
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
        console.log(y);
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  }
}
