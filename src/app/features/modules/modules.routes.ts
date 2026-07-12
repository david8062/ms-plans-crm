import { Routes } from '@angular/router';

export const MODULES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/modules-list/modules-list.component').then(m => m.ModulesListComponent),
  },
];
