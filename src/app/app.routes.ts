import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Expenses } from './features/expenses/expenses';
import { Budgets } from './features/budgets/budgets';
import { Statistics } from './features/statistics/statistics';
import { Categories } from './features/categories/categories';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    data: { headerText: 'Dashboard' },
    canActivate: [authGuard],
  },
  {
    path: 'budgets',
    component: Budgets,
    data: { headerText: 'Budgets' },
    canActivate: [authGuard],
  },
  {
    path: 'expenses',
    component: Expenses,
    data: { headerText: 'Expenses' },
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    component: Categories,
    data: { headerText: 'Categories' },
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    component: Statistics,
    data: { headerText: 'Statistics' },
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    component: Signup,
    data: { headerText: 'Register' },
  },
  {
    path: 'login',
    component: Login,
    data: { headerText: 'Sign In' },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
];
