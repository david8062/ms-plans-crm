import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { testImports, testProviders } from '../../../../testing/test-setup';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
