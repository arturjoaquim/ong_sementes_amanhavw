import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ConfirmDialogModule, ToastModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <p-toast position="top-right" />
      <p-confirmDialog [style]="{ width: '450px' }" />
      <app-sidebar />

      <main class="ml-64 pt-16">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
