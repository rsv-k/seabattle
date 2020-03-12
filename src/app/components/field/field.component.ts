import { Component, OnInit } from '@angular/core';
import { SeabattleService } from '../../services/seabattle.service';
import { Cell } from '../../models/cell.modules';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  rowsAndColumns = new Array(10).fill(0);
  field: Cell[][];
  isGameOver = false;
  letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  history: string[];

  constructor(private seabattleService: SeabattleService) { }

  ngOnInit(): void {
    this.field = createField();
    this.seabattleService.getUserInfo();
    this.seabattleService.userInfoDataUpdateListener()
      .subscribe((data) => {
        for (const cell of data.shotCells) {
          this.field[cell.y][cell.x] = cell;
        }

        this.history = data.history;
        this.isGameOver = this.seabattleService.isGameOver();
      });
  }

  startOver() {
    this.seabattleService.startOver();
    this.field = createField();
    this.isGameOver = false;
  }

  reject() {
    this.isGameOver = false;
  }
}


function createField() {
  const field = [];

  for (let y = 0; y < 10; y++) {
    field[y] = [];
    for (let x = 0; x < 10; x++) {
      field[y][x] = {
        y,
        x,
        value: 0,
        condition: 'alive'
      };
    }
  }

  return field;
}
