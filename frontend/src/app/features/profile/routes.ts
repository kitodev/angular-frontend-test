import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    title: 'Profile',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then((page) => page.ProfilePageComponent),
  },
];
