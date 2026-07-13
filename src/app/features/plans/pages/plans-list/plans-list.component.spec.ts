import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansListComponent } from './plans-list.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('PlansListComponent', () => {
  let component: PlansListComponent;
  let fixture: ComponentFixture<PlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansListComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(PlansListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
