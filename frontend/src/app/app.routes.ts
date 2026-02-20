import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () =>
      import('./features/shell/shell.component').then((module) => module.ShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: async () =>
          import('./features/home/home.component').then((module) => module.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: async () =>
          import('./features/auth/login.component').then((module) => module.LoginComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
