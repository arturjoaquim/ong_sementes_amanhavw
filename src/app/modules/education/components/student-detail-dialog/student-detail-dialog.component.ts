import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Student } from '../../types/student.type';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import {
  AvatarComponent,
  AvatarFallbackComponent,
} from '../../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { TabsComponent } from '../../../../shared/components/tab/tabs.component';
import { Tab } from '../../../../shared/types/tab.type';
import { StudentGeneralDetailComponent } from './student-general-detail.component';
import { StudentFamilyDetailComponent } from './student-family-detail.component';
import { StudentHealthDetailComponent } from './student-health-detail.component';
import { StudentAcademicDetailComponent } from './student-academic-detail.component';
import { StudentSocialDetailComponent } from './student-social-detail.component';

@Component({
  selector: 'app-student-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogDescriptionComponent,
    DialogTitleComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    BadgeComponent,
    StudentGeneralDetailComponent,
    StudentFamilyDetailComponent,
    StudentHealthDetailComponent,
    StudentAcademicDetailComponent,
    StudentSocialDetailComponent,
    TabsComponent,
  ],
  templateUrl: './student-detail-dialog.component.html',
})
export class StudentDetailDialogComponent {
  private dialogRef = inject(DialogRef<void>);
  public data = inject<{ student: Student }>(DIALOG_DATA);
  public student = signal<Student>(this.data.student);

  public activeTab = 'general';

  public dialogTabs: Tab[] = [
    { id: 'general', label: 'Dados Gerais' },
    { id: 'family', label: 'Família' },
    { id: 'health', label: 'Saúde' },
    { id: 'academic', label: 'Acadêmico' },
    { id: 'social', label: 'Social' },
  ];

  icons = {
    x: X,
  };

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.student().personData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get name(): string {
    return this.student().personData.personName;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  close(): void {
    this.dialogRef.close();
  }

  getAttendanceColor(attendance: number): string {
    return attendance >= 90
      ? 'text-green-600'
      : attendance >= 75
        ? 'text-orange-600'
        : 'text-red-600';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
