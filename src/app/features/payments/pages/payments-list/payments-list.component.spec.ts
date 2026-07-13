import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsListComponent } from './payments-list.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('PaymentsListComponent', () => {
  let component: PaymentsListComponent;
  let fixture: ComponentFixture<PaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsListComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
