import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
  {
    path: 'plans',
    canActivate: [authGuard],
    loadChildren: () => import('./features/plans/plans.routes').then(m => m.PLANS_ROUTES),
  },
  {
    path: 'subscriptions',
    canActivate: [authGuard],
    loadChildren: () => import('./features/subscriptions/subscriptions.routes').then(m => m.SUBSCRIPTIONS_ROUTES),
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadChildren: () => import('./features/payments/payments.routes').then(m => m.PAYMENTS_ROUTES),
  },
  {
    path: 'churn',
    canActivate: [authGuard],
    loadChildren: () => import('./features/churn/churn.routes').then(m => m.CHURN_ROUTES),
  },
  {
    path: 'modules',
    canActivate: [authGuard],
    loadChildren: () => import('./features/modules/modules.routes').then(m => m.MODULES_ROUTES),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
