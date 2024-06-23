import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/routes').then((routes) => routes.HOME_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes').then((routes) => routes.ADMIN_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/routes').then((routes) => routes.PROFILE_ROUTES),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/',
  },
];
