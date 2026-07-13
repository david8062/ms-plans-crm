import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurnModalComponent } from './churn-modal.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('ChurnModalComponent', () => {
  let component: ChurnModalComponent;
  let fixture: ComponentFixture<ChurnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChurnModalComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(ChurnModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
