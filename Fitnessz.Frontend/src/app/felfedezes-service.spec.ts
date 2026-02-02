import { TestBed } from '@angular/core/testing';

import { FelfedezesService } from './felfedezes-service';

describe('FelfedezesService', () => {
  let service: FelfedezesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FelfedezesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
