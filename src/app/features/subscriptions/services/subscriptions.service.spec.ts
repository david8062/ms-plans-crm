import { TestBed } from '@angular/core/testing';

import { SubscriptionsService } from './subscriptions.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(SubscriptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
