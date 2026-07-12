import { Routes } from '@angular/router';

export const PLANS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/plans-list/plans-list.component').then(m => m.PlansListComponent),
  },
];
