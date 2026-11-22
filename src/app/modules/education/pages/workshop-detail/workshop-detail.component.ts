import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Briefcase, Calendar, MapPin, Users, Clock, Link, Pencil, Trash2, Plus, UserPlus, UserMinus, CheckSquare, AlertCircle } from 'lucide-angular';
import { Dialog } from '@angular/cdk/dialog';
import { Workshop, WorkshopSession } from '../../types/workshop.type';
import { WorkshopService } from '../../services/workshop.service';
import { StudentService } from '../../services/student.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { SectionHeaderComponent } from '../../components/student-detail-dialog/section-header.component';
import { DynamicFormDialogComponent } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { WorkshopSessionFormDialogComponent } from '../../components/workshop-session-form-dialog/workshop-session-form-dialog.component';
import { WorkshopPresenceDialogComponent } from '../../components/workshop-presence-dialog/workshop-presence-dialog.component';

@Component({
  selector: 'app-workshop-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    PageLayoutComponent,
    CardComponent,
    BadgeComponent,
    ButtonDirective,
    SectionHeaderComponent,
  ],
  templateUrl: './workshop-detail.component.html',
})
export class WorkshopDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private workshopService = inject(WorkshopService);
  private studentService = inject(StudentService);

  workshop = signal<Workshop | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  icons = {
    arrowLeft: ArrowLeft,
    briefcase: Briefcase,
    calendar: Calendar,
    mapPin: MapPin,
    users: Users,
    clock: Clock,
    link: Link,
    pencil: Pencil,
    trash: Trash2,
    plus: Plus,
    userPlus: UserPlus,
    userMinus: UserMinus,
    checkSquare: CheckSquare,
    alertCircle: AlertCircle,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadWorkshop(Number(id));
    } else {
      this.errorMessage.set('Identificador da oficina não informado.');
      this.loading.set(false);
    }
  }

  loadWorkshop(id: number): void {
    this.loading.set(true);
    this.workshopService.getWorkshopById(id).subscribe({
      next: (data) => {
        this.workshop.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da oficina', err);
        this.errorMessage.set('Não foi possível carregar os dados da oficina.');
        this.loading.set(false);
      },
    });
  }

  reloadWorkshop(): void {
    const current = this.workshop();
    if (current) {
      this.workshopService.getWorkshopById(current.id).subscribe((w) => {
        this.workshop.set(w);
      });
    }
  }

  back(): void {
    this.router.navigate(['/workshops']);
  }

  getStatusColor(active: boolean | undefined): string {
    return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  }

  editGeneralInfo(): void {
    const w = this.workshop();
    if (!w) return;

    const formConfig = [
      { name: 'name', label: 'Nome da Oficina', type: 'text', required: true },
      { name: 'enrollmentLimit', label: 'Limite de Participantes', type: 'text', required: true },
      {
        name: 'active',
        label: 'Ativa',
        type: 'select',
        options: [
          { value: true, viewValue: 'Sim' },
          { value: false, viewValue: 'Não' },
        ],
        required: true,
      },
    ];

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: {
        title: 'Editar Informações Gerais',
        formConfig,
        initialData: {
          name: w.name,
          enrollmentLimit: w.enrollmentLimit,
          active: w.active,
        },
      },
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        const updatedWorkshop = { ...w, ...result };
        this.workshopService.updateWorkshop(updatedWorkshop).subscribe({
          next: () => {
            alert('Informações atualizadas com sucesso!');
            this.reloadWorkshop();
          },
          error: () => {
            alert('Erro ao atualizar informações.');
          },
        });
        this.workshop.set(updatedWorkshop);
      }
    });
  }

  addSession(): void {
    const w = this.workshop();
    if (!w) return;

    const dialogRef = this.dialog.open(WorkshopSessionFormDialogComponent, {
      data: { workshopId: w.id },
      width: '90vw',
      maxWidth: '500px',
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        this.reloadWorkshop();
      }
    });
  }

  editSession(session: WorkshopSession): void {
    const formConfig = [
      { name: 'description', label: 'Descrição', type: 'text', required: true },
      { name: 'attendanceListLink', label: 'Link Lista de Presença', type: 'text' },
    ];

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: {
        title: 'Editar Sessão',
        formConfig,
        initialData: {
          description: session.description,
          attendanceListLink: session.attendanceListLink,
        },
      },
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        alert('Edição de sessão não implementada no backend ainda.');
      }
    });
  }

  deleteSession(sessionId: number): void {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      alert('Exclusão de sessão não implementada no backend ainda.');
    }
  }

  addEnrollment(): void {
    const w = this.workshop();
    if (!w) return;

    this.studentService.searchStudentsPreview({}).subscribe((students) => {
      const studentOptions = students.map((s) => ({ value: s.id, viewValue: s.name }));

      const formConfig = [
        {
          name: 'studentId',
          label: 'Selecione o Aluno',
          type: 'select',
          options: studentOptions,
          required: true,
        },
      ];

      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: { title: 'Matricular Aluno', formConfig },
      });

      dialogRef.closed.subscribe((result: any) => {
        if (result) {
          this.workshopService.enrollStudent(w.id, result.studentId).subscribe({
            next: () => {
              alert('Aluno matriculado com sucesso!');
              this.reloadWorkshop();
            },
            error: (err) => {
              console.error('Erro ao matricular aluno', err);
              alert('Erro ao matricular aluno.');
            },
          });
        }
      });
    });
  }

  removeEnrollment(studentId: number): void {
    const w = this.workshop();
    if (!w) return;

    if (confirm('Tem certeza que deseja remover a matrícula deste aluno?')) {
      this.workshopService.unenrollStudent(w.id, studentId).subscribe({
        next: () => {
          alert('Matrícula removida com sucesso!');
          this.reloadWorkshop();
        },
        error: (err) => {
          console.error('Erro ao remover matrícula', err);
          alert('Erro ao remover matrícula.');
        },
      });
    }
  }

  managePresences(session: WorkshopSession): void {
    const w = this.workshop();
    if (!w) return;

    const dialogRef = this.dialog.open<number[]>(WorkshopPresenceDialogComponent, {
      data: {
        session: session,
        enrolledStudents: w.enrolledStudents,
      },
      width: '90vw',
      maxWidth: '500px',
    });

    dialogRef.closed.subscribe((result: number[] | undefined) => {
      if (result) {
        this.workshopService.updateSessionPresences(session.id, result).subscribe({
          next: () => {
            alert('Presenças atualizadas com sucesso!');
            this.reloadWorkshop();
          },
          error: (err) => {
            console.error('Erro ao atualizar presenças', err);
            alert('Erro ao atualizar presenças.');
          },
        });
      }
    });
  }
}
