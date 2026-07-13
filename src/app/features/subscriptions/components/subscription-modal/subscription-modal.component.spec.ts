import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionModalComponent } from './subscription-modal.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('SubscriptionModalComponent', () => {
  let component: SubscriptionModalComponent;
  let fixture: ComponentFixture<SubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionModalComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
