import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home-page/home-page.component').then((page) => page.HomePageComponent),
  },
];
