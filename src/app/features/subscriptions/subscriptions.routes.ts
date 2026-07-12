import { Routes } from '@angular/router';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/subscriptions-list/subscriptions-list.component').then(m => m.SubscriptionsListComponent),
  },
];
