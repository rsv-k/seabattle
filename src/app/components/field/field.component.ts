import { Component, OnInit } from '@angular/core';
import { SeabattleService } from '../../services/seabattle.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  rowsAndColumns = new Array(10).fill(0);
  letters = ['empty', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  history;

  constructor(private seabattleService: SeabattleService) { }

  ngOnInit(): void {
    this.seabattleService.getUserInfo();
    this.seabattleService.userInfoDataUpdateListener()
      .subscribe((data) => {
      });
  }

}
