import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('ModulesService', () => {
  let service: ModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(ModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
