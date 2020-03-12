import { Directive, ElementRef, OnInit, Input, HostListener } from '@angular/core';
import { Cell } from '../models/cell.modules';
import { SeabattleService } from '../services/seabattle.service';

@Directive({
  selector: '[appCell]'
})
export class CellDirective implements OnInit {
  @Input() info: Cell;

  constructor(private elemRef: ElementRef,
              private seabattleService: SeabattleService) { }

  ngOnInit() {
    const elem = this.elemRef.nativeElement;
    if (this.info) {
      this.updateCellBackground();
    } else {
      elem.style.textAlign = 'center';
      elem.style.lineHeight = '40px';
    }

    elem.style.border = `1px solid ${this.info ? 'black' : 'transparent'}`;
    elem.style.width = '40px';
    elem.style.height = '40px';
  }

  updateCellBackground() {
    const cellConditions = {
      alive: '',
      empty: 'rgba(0, 0, 0, 0.5)',
      wounded: 'orange',
      destroyed: 'red'
    };

    this.elemRef.nativeElement.style.background = cellConditions[this.info.condition];
  }

  @HostListener('click') onMouseClick() {
    if (!this.info || this.info.condition !== 'alive' || this.seabattleService.isGameOver()) {
      return;
    }

    const conditionResult = this.seabattleService.updateCell(this.info.x, this.info.y);
    this.info.condition = conditionResult;

    this.updateCellBackground();
  }
}
