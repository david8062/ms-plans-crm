import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleModalComponent } from './module-modal.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('ModuleModalComponent', () => {
  let component: ModuleModalComponent;
  let fixture: ComponentFixture<ModuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleModalComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
