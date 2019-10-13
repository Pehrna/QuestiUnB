import { TestBed } from '@angular/core/testing';

import { Auth.TypesService } from './auth.types.service';

describe('Auth.TypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Auth.TypesService = TestBed.get(Auth.TypesService);
    expect(service).toBeTruthy();
  });
});
