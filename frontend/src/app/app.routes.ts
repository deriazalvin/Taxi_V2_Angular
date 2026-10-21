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
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'clients/new',
        loadComponent: () =>
          import('./features/clients/client-form/client-form').then((m) => m.ClientForm),
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () =>
          import('./features/clients/client-form/client-form').then((m) => m.ClientForm),
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
        loadComponent: () =>
          import('./features/vehicles/vehicle-list/vehicle-list').then((m) => m.VehicleList),
      },
      {
        path: 'vehicles/new',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form/vehicle-form').then((m) => m.VehicleForm),
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form/vehicle-form').then((m) => m.VehicleForm),
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
