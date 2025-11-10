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
import { converterToClassName } from '../../utils/classname-converter.util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [LucideAngularModule, RouterModule],
})
export class SidebarComponent {
  readonly menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/' },
    { id: 'students', label: 'Students', icon: Users, route: '/students' },
    { id: 'workshops', label: 'Workshops', icon: Calendar, route: '/workshops' },
    { id: 'employees', label: 'Employees', icon: Briefcase, route: '/employees' },
    { id: 'guardians', label: 'Guardians', icon: UserCircle, route: '/guardians' },
    { id: 'inventory', label: 'Inventory', icon: Package, route: '/inventory' },
    { id: 'reports', label: 'Reports', icon: FileText, route: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  activePageId = signal('dashboard');

  getMenuItemClass(menuItemId: string): string {
    return converterToClassName({
      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all': true,
      'bg-green-50 text-green-700': menuItemId === this.activePageId(),
      'text-gray-600 hover:bg-gray-50 hover:text-gray-900': menuItemId !== this.activePageId(),
    });
  }

  onClickMenuItem(menuItemId: string): void {
    this.activePageId.set(menuItemId);
  }
}
