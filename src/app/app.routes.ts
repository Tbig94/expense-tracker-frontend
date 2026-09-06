import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    data: { headerText: 'Dashboard' },
    canActivate: [authGuard],
  },
  {
    path: 'budgets',
    loadComponent: () => import('./features/budgets/budgets').then((m) => m.Budgets),
    data: { headerText: 'Budgets' },
    canActivate: [authGuard],
  },
  {
    path: 'expenses',
    loadComponent: () => import('./features/expenses/expenses').then((m) => m.Expenses),
    data: { headerText: 'Expenses' },
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
    data: { headerText: 'Categories' },
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    loadComponent: () => import('./features/statistics/statistics').then((m) => m.Statistics),
    data: { headerText: 'Statistics' },
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/account').then((m) => m.Account),
    data: { headerText: 'Account' },
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup').then((m) => m.Signup),
    data: { headerText: 'Register' },
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
    data: { headerText: 'Sign In' },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
];
