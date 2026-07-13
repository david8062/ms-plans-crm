import { TestBed } from '@angular/core/testing';

import { ChurnService } from './churn.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('ChurnService', () => {
  let service: ChurnService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(ChurnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
