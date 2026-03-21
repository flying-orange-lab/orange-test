import { Component, inject, OnInit } from '@angular/core';
import { WildAdditionalPokemonCategory } from 'src/app/models/wild-additional.model';
import { WildAdditionalService } from 'src/app/services/wild-additional.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-wild-additional',
  imports: [MatTabsModule, MatTableModule],
  templateUrl: './wild-additional.component.html',
  styleUrl: './wild-additional.component.less',
})
export class WildAdditionalComponent implements OnInit {
  private wildAdditionalService = inject(WildAdditionalService);

  wildAdditionalDatas: WildAdditionalPokemonCategory[] = [];
  displayedColumns: string[] = [
    'name',
    'level',
    'location',
    'requirement',
    'note',
  ];

  ngOnInit(): void {
    this.wildAdditionalDatas = this.wildAdditionalService.wildAdditionalDatas;
  }
}
