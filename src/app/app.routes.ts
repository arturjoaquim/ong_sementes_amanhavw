import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
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
];
