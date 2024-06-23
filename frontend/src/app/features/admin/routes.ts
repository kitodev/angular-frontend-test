import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Admin',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then((page) => page.AdminPageComponent),
  },
];
