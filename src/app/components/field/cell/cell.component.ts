import { Component, OnInit, Input } from '@angular/core';
import { SeabattleService } from '../../../services/seabattle.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() value;
  @Input() info;

  constructor(private seabattleService: SeabattleService) { }

  ngOnInit(): void {
    if (this.value) {
      return;
    }

    const hash = this.seabattleService.getShotCellsHashed();

    if (hash[this.info.y + '-' + this.info.x]) {
      this.info = hash[this.info.y + '-' + this.info.x];
    }
  }

  shoot() {
    if (this.info.condition !== 'alive') {
      return;
    }
    const ships = this.seabattleService.getShips();

    const shipCell = ships.find(ship => ship.find(cell => cell.x === this.info.x && cell.y === this.info.y));
    console.log(shipCell);
    // this.info.condition = 'shot';

  }

}
