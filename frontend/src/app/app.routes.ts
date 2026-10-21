import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clients',
        data: { title: 'Clients' },
        loadComponent: () =>
          import('./features/shared/section-placeholder/section-placeholder').then(
            (m) => m.SectionPlaceholder,
          ),
      },
      {
        path: 'drivers',
        data: { title: 'Chauffeurs' },
        loadComponent: () =>
          import('./features/shared/section-placeholder/section-placeholder').then(
            (m) => m.SectionPlaceholder,
          ),
      },
      {
        path: 'vehicles',
        data: { title: 'Véhicules' },
        loadComponent: () =>
          import('./features/shared/section-placeholder/section-placeholder').then(
            (m) => m.SectionPlaceholder,
          ),
      },
      {
        path: 'rides',
        data: { title: 'Courses' },
        loadComponent: () =>
          import('./features/shared/section-placeholder/section-placeholder').then(
            (m) => m.SectionPlaceholder,
          ),
      },
      {
        path: 'statistics',
        data: { title: 'Statistiques' },
        loadComponent: () =>
          import('./features/shared/section-placeholder/section-placeholder').then(
            (m) => m.SectionPlaceholder,
          ),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'], title: 'Administration' },
        loadComponent: () => import('./features/admin/admin').then((m) => m.Admin),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
