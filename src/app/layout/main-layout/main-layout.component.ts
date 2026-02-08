import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-sidebar />

      <main class="ml-64 pt-16">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
