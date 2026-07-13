import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsListComponent } from './subscriptions-list.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('SubscriptionsListComponent', () => {
  let component: SubscriptionsListComponent;
  let fixture: ComponentFixture<SubscriptionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionsListComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
