import { Component } from '@angular/core';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { Users, Package, Calendar, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-initial-dashboard',
  templateUrl: './initial-dashboard.component.html',
  standalone: true,
  imports: [StatCardComponent],
})
export class InitialDashboardComponent {
  protected readonly UsersIcon = Users;
  protected readonly PackageIcon = Package;
  protected readonly CalendarIcon = Calendar;
  protected readonly TrendingUpIcon = TrendingUp;
}
