import { TestBed } from '@angular/core/testing';

import { LocService } from './loc.service';

describe('LocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocService = TestBed.get(LocService);
    expect(service).toBeTruthy();
  });
});
