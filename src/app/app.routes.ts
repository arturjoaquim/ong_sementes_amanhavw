import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard], // O Guard protege o layout inteiro
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/pages/initial-dashboard/initial-dashboard.component').then(
            (m) => m.InitialDashboardComponent,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./modules/education/pages/student/student.component').then((m) => m.StudentComponent),
      },
      {
        path: 'workshops',
        loadComponent: () =>
          import('./modules/education/pages/workshop/workshop.component').then((m) => m.WorkshopComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./modules/education/pages/employee/employee.component').then((m) => m.EmployeeComponent),
      },
    ]
  },
  // Rota coringa para redirecionar qualquer URL desconhecida para o login ou dashboard
  {
    path: '**',
    redirectTo: ''
  }
];
