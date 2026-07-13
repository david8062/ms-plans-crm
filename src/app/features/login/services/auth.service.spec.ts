import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
