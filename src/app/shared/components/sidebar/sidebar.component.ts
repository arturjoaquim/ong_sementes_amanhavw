import { Component, signal } from '@angular/core';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  UserCircle,
  Package,
  FileText,
  Settings,
  LucideAngularModule,
} from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [LucideAngularModule, RouterModule, CommonModule],
})
export class SidebarComponent {
  readonly menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/' },
    { id: 'students', label: 'Alunos', icon: Users, route: '/students' },
    { id: 'workshops', label: 'Oficinas', icon: Calendar, route: '/workshops' },
    { id: 'employees', label: 'Funcionários', icon: Briefcase, route: '/employees' },
    //{ id: 'inventory', label: 'Estoque', icon: Package, route: '/inventory' },
    { id: 'reports', label: 'Relatórios', icon: FileText, route: '/reports' },
    //{ id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  activePageId = signal('dashboard');

  onClickMenuItem(menuItemId: string): void {
    this.activePageId.set(menuItemId);
  }
}
