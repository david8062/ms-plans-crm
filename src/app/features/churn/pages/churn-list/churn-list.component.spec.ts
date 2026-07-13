import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurnListComponent } from './churn-list.component';
import { testImports, testProviders } from '../../../../../testing/test-setup';

describe('ChurnListComponent', () => {
  let component: ChurnListComponent;
  let fixture: ComponentFixture<ChurnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChurnListComponent, ...testImports],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(ChurnListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
