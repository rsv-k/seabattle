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
  @Input() hash;

  constructor(private seabattleService: SeabattleService) { }

  ngOnInit(): void {

  }

  shoot() {
    if (this.info.condition !== 'alive') {
      return;
    }

    const shot = this.seabattleService.updateCell(this.info.x, this.info.y);
    if (shot) {
      this.info = shot;
    } else {
      this.info.condition = 'shot';
    }
  }

}
