import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscription } from '../../models/subscription.model';

import { SubscriptionModulesModalComponent } from './subscription-modules-modal.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('SubscriptionModulesModalComponent', () => {
  let component: SubscriptionModulesModalComponent;
  let fixture: ComponentFixture<SubscriptionModulesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionModulesModalComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionModulesModalComponent);
    component = fixture.componentInstance;
    // `sub` es @Input({ required: true }): el componente lo usa en ngOnInit para
    // pedir los módulos, así que sin él revienta antes de renderizar.
    fixture.componentRef.setInput('sub', { id: 'sub-test' } as Subscription);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
