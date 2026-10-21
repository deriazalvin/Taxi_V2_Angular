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
        loadComponent: () =>
          import('./features/drivers/driver-list/driver-list').then((m) => m.DriverList),
      },
      {
        path: 'drivers/new',
        loadComponent: () =>
          import('./features/drivers/driver-form/driver-form').then((m) => m.DriverForm),
      },
      {
        path: 'drivers/:id/edit',
        loadComponent: () =>
          import('./features/drivers/driver-form/driver-form').then((m) => m.DriverForm),
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
        loadComponent: () => import('./features/rides/ride-list/ride-list').then((m) => m.RideList),
      },
      {
        path: 'rides/new',
        loadComponent: () => import('./features/rides/ride-form/ride-form').then((m) => m.RideForm),
      },
      {
        path: 'rides/waiting',
        loadComponent: () =>
          import('./features/rides/ride-waiting/ride-waiting').then((m) => m.RideWaiting),
      },
      {
        path: 'rides/:id',
        loadComponent: () =>
          import('./features/rides/ride-detail/ride-detail').then((m) => m.RideDetail),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/statistics/statistics-page/statistics-page').then(
            (m) => m.StatisticsPage,
          ),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'], title: 'Administration' },
        loadComponent: () =>
          import('./features/admin/admin-users/admin-users').then((m) => m.AdminUsers),
      },
      {
        path: 'admin/score',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'], title: 'Scoring' },
        loadComponent: () =>
          import('./features/admin/admin-score/admin-score').then((m) => m.AdminScore),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
