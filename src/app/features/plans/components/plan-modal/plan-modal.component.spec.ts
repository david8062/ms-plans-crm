import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModalComponent } from './plan-modal.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('PlanModalComponent', () => {
  let component: PlanModalComponent;
  let fixture: ComponentFixture<PlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanModalComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
