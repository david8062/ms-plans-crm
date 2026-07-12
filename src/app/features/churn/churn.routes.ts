import { Routes } from '@angular/router';

export const CHURN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/churn-list/churn-list.component').then(m => m.ChurnListComponent),
  },
];
