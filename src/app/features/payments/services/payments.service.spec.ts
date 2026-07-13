import { TestBed } from '@angular/core/testing';

import { PaymentsService } from './payments.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(PaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
