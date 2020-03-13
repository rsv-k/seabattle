import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  @Output() playAgain = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }


  startOver() {
    this.playAgain.emit();
  }
}
