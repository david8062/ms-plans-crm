import { TestBed } from '@angular/core/testing';

import { PlansService } from './plans.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(PlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
