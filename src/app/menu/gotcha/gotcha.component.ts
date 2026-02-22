import { Component, inject, OnInit } from '@angular/core';
import { GotchaPokemonCategory } from 'src/app/models/gotcha.model';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-gotcha',
  imports: [MatTabsModule, MatTableModule],
  templateUrl: './gotcha.component.html',
  styleUrl: './gotcha.component.less',
})
export class GotchaComponent implements OnInit {
  private dataHandleService = inject(DataHandleService);

  gotchaDatas: GotchaPokemonCategory[] = [];
  displayedColumns: string[] = [
    'name',
    'level',
    'location',
    'requirement',
    'note',
  ];

  ngOnInit(): void {
    this.gotchaDatas = this.dataHandleService.gotchaDatas;
  }
}
