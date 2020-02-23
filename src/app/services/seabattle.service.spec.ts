import { TestBed } from '@angular/core/testing';

import { SeabattleService } from './seabattle.service';

describe('SeabattleService', () => {
  let service: SeabattleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeabattleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
