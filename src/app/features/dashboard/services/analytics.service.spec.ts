import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
