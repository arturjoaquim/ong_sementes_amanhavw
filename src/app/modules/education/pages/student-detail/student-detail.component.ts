import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Users, AlertCircle } from 'lucide-angular';
import { Student } from '../../types/student.type';
import { StudentService } from '../../services/student.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { AvatarComponent, AvatarFallbackComponent } from '../../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { TabsComponent } from '../../../../shared/components/tab/tabs.component';
import { Tab } from '../../../../shared/types/tab.type';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { StudentGeneralDetailComponent } from '../../components/student-detail-dialog/student-general-detail.component';
import { StudentFamilyDetailComponent } from '../../components/student-detail-dialog/student-family-detail.component';
import { StudentHealthDetailComponent } from '../../components/student-detail-dialog/student-health-detail.component';
import { StudentAcademicDetailComponent } from '../../components/student-detail-dialog/student-academic-detail.component';
import { SchoolGradeMap } from '../../../../shared/utils/lookup.enums';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    PageLayoutComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    BadgeComponent,
    TabsComponent,
    ButtonDirective,
    StudentGeneralDetailComponent,
    StudentFamilyDetailComponent,
    StudentHealthDetailComponent,
    StudentAcademicDetailComponent,
  ],
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  studentSignal = signal<Student | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  get student(): WritableSignal<Student> {
    return this.studentSignal as WritableSignal<Student>;
  }

  activeTab = 'general';

  tabs: Tab[] = [
    { id: 'general', label: 'Dados Gerais' },
    { id: 'family', label: 'Família' },
    { id: 'health', label: 'Saúde' },
    { id: 'academic', label: 'Acadêmico' },
  ];

  icons = {
    arrowLeft: ArrowLeft,
    users: Users,
    alertCircle: AlertCircle,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudent(Number(id));
    } else {
      this.errorMessage.set('Identificador do estudante não informado.');
      this.loading.set(false);
    }
  }

  loadStudent(id: number): void {
    this.loading.set(true);
    this.studentService.getStudentDetailsById(id).subscribe({
      next: (data) => {
        this.studentSignal.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do estudante', err);
        this.errorMessage.set('Não foi possível carregar os dados do estudante.');
        this.loading.set(false);
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  back(): void {
    this.router.navigate(['/students']);
  }

  get age(): number {
    const s = this.student();
    if (!s?.personData?.birthDate) return 0;
    const today = new Date();
    const birthDate = new Date(s.personData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get name(): string {
    return this.student()?.personData?.personName || '';
  }

  get studyLevel(): string {
    const studyLevelId = this.student()?.personData?.education?.educationLevelId;
    if (!studyLevelId) return 'N/A';
    return SchoolGradeMap[studyLevelId]?.descricao || 'N/A';
  }

  getAttendanceColor(attendance: number | undefined): string {
    if (attendance === undefined) return 'text-gray-600';
    return attendance >= 90
      ? 'text-green-600'
      : attendance >= 75
        ? 'text-orange-600'
        : 'text-red-600';
  }

  getStatusColor(status: string | undefined): string {
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
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || '')
      .join('');
  }
}
