import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Output() playAgain = new EventEmitter<void>();
  @Output() later = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  startOver() {
    this.playAgain.emit();
  }

  reject() {
    this.later.emit();
  }
}
