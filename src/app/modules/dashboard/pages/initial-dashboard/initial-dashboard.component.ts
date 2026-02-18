import { Component, inject, OnInit, signal } from '@angular/core';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { Users, Package, Calendar, TrendingUp, Activity, Clock } from 'lucide-angular';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStatsDTO } from '../../types/dashboard-stats.dto';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RecentActivityDTO } from '../../types/recent-activity.dto';
import { DashboardDistributionDTO } from '../../types/dashboard-distribution.dto';
import { Dialog } from '@angular/cdk/dialog';
import { StudentCreationDialogComponent } from '../../../education/components/student-creation-dialog/student-creation-dialog.component';
import { WorkshopFormDialogComponent } from '../../../education/components/workshop-form-dialog/workshop-form-dialog.component';
import { WorkshopService } from '../../../education/services/workshop.service';
import { Workshop } from '../../../education/types/workshop.type';

@Component({
  selector: 'app-initial-dashboard',
  templateUrl: './initial-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, StatCardComponent, LucideAngularModule],
})
export class InitialDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private dialog = inject(Dialog);
  private workshopService = inject(WorkshopService);

  protected readonly UsersIcon = Users;
  protected readonly PackageIcon = Package;
  protected readonly CalendarIcon = Calendar;
  protected readonly TrendingUpIcon = TrendingUp;
  protected readonly ActivityIcon = Activity;
  protected readonly ClockIcon = Clock;

  stats = signal<DashboardStatsDTO>({
    totalStudents: 0,
    totalWorkshops: 0,
    totalEmployees: 0
  });

  activities = signal<any[]>([]);
  distribution = signal<DashboardDistributionDTO>({
    activeStudentsPercentage: 0,
    fullWorkshopsPercentage: 0
  });

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe(data => {
      this.stats.set(data);
    });

    this.dashboardService.getRecentActivities().subscribe(data => {
      const mappedActivities = data.map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        time: new Date(activity.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        icon: this.getIconForType(activity.type),
        color: this.getColorForType(activity.type),
        bg: this.getBgForType(activity.type)
      }));
      this.activities.set(mappedActivities);
    });

    this.dashboardService.getDistribution().subscribe(data => {
      this.distribution.set(data);
    });
  }

  openNewStudentDialog() {
    const dialogRef = this.dialog.open(StudentCreationDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadDashboardData(); // Recarrega dashboard após criar
      }
    });
  }

  openNewWorkshopDialog() {
    const dialogRef = this.dialog.open<Workshop>(WorkshopFormDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
          this.workshopService.createWorkshop(result).subscribe({
              next: () => {
                  alert('Oficina criada com sucesso!');
                  this.loadDashboardData(); // Recarrega dashboard
              },
              error: (err) => {
                  console.error('Erro ao criar oficina', err);
                  alert('Erro ao criar oficina.');
              }
          });
      }
    });
  }

  private getIconForType(type: string) {
    switch (type) {
      case 'STUDENT': return Users;
      case 'WORKSHOP': return Calendar;
      case 'EMPLOYEE': return TrendingUp;
      default: return Activity;
    }
  }

  private getColorForType(type: string) {
    switch (type) {
      case 'STUDENT': return 'text-green-500';
      case 'WORKSHOP': return 'text-blue-500';
      case 'EMPLOYEE': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  }

  private getBgForType(type: string) {
    switch (type) {
      case 'STUDENT': return 'bg-green-100';
      case 'WORKSHOP': return 'bg-blue-100';
      case 'EMPLOYEE': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  }
}
