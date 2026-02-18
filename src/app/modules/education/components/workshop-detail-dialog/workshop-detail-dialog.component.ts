import { Component, inject, signal } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef, Dialog } from '@angular/cdk/dialog';
import { Workshop, WorkshopSession } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { LucideAngularModule, User, Calendar, MapPin, Users, Clock, Link, Pencil, Trash2, Plus, UserPlus, UserMinus, CheckSquare } from 'lucide-angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { WorkshopService } from '../../services/workshop.service';
import { SectionHeaderComponent } from '../student-detail-dialog/section-header.component';
import { DynamicFormDialogComponent, DynamicFormDialogData } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { WorkshopSessionFormDialogComponent } from '../workshop-session-form-dialog/workshop-session-form-dialog.component';
import { StudentService } from '../../services/student.service';
import { StudentPreview } from '../../types/student-preview.type';
import { WorkshopPresenceDialogComponent } from '../workshop-presence-dialog/workshop-presence-dialog.component';

@Component({
  selector: 'app-workshop-detail-dialog',
  templateUrl: './workshop-detail-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    BadgeComponent,
    LucideAngularModule,
    CardComponent,
    SectionHeaderComponent,
    ButtonDirective
  ],
})
export class WorkshopDetailDialogComponent {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef>(DialogRef);
  private dialog = inject(Dialog);
  private workshopService = inject(WorkshopService);
  private studentService = inject(StudentService);

  workshop = signal<Workshop>(this.data.workshop);

  icons = {
    user: User,
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
    checkSquare: CheckSquare
  };

  getStatusColor(active: boolean): string {
    return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  }

  editGeneralInfo() {
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
          name: this.workshop().name,
          enrollmentLimit: this.workshop().enrollmentLimit,
          active: this.workshop().active
        }
      }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        const updatedWorkshop = { ...this.workshop(), ...result };
        console.log(updatedWorkshop);
        this.workshopService.updateWorkshop(updatedWorkshop).subscribe({
          next: () => {
            alert('Informações atualizadas com sucesso!');
            this.reloadWorkshop();
          },
          error: () => {
            alert('Erro ao atualizar informações.');
          }
        }
        );
        this.workshop.set(updatedWorkshop);
        //this.reloadWorkshop();
      }
    });
  }

  addSession() {
      const dialogRef = this.dialog.open(WorkshopSessionFormDialogComponent, {
          data: { workshopId: this.workshop().id },
          width: '90vw',
          maxWidth: '500px',
      });

      dialogRef.closed.subscribe((result: any) => {
          if (result) {
              this.reloadWorkshop();
          }
      });
  }

  editSession(session: WorkshopSession) {
      const formConfig = [
          { name: 'description', label: 'Descrição', type: 'text', required: true },
          { name: 'attendanceListLink', label: 'Link Lista de Presença', type: 'text' }
      ];

      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
          data: {
              title: 'Editar Sessão',
              formConfig,
              initialData: {
                  description: session.description,
                  attendanceListLink: session.attendanceListLink
              }
          }
      });

      dialogRef.closed.subscribe((result: any) => {
          if (result) {
              console.log('Update session not implemented yet', result);
              alert('Edição de sessão não implementada no backend ainda.');
          }
      });
  }

  deleteSession(sessionId: number) {
      if (confirm('Tem certeza que deseja excluir esta sessão?')) {
          console.log('Delete session not implemented yet', sessionId);
          alert('Exclusão de sessão não implementada no backend ainda.');
      }
  }

  addEnrollment() {
      this.studentService.searchStudentsPreview({}).subscribe(students => {
          const studentOptions = students.map(s => ({ value: s.id, viewValue: s.name }));

          const formConfig = [
              {
                  name: 'studentId',
                  label: 'Selecione o Aluno',
                  type: 'select',
                  options: studentOptions,
                  required: true
              }
          ];

          const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
              data: { title: 'Matricular Aluno', formConfig }
          });

          dialogRef.closed.subscribe((result: any) => {
              if (result) {
                  this.workshopService.enrollStudent(this.workshop().id, result.studentId).subscribe({
                      next: () => {
                          alert('Aluno matriculado com sucesso!');
                          this.reloadWorkshop();
                      },
                      error: (err) => {
                          console.error('Erro ao matricular aluno', err);
                          alert('Erro ao matricular aluno.');
                      }
                  });
              }
          });
      });
  }

  removeEnrollment(studentId: number) {
      if (confirm('Tem certeza que deseja remover a matrícula deste aluno?')) {
          this.workshopService.unenrollStudent(this.workshop().id, studentId).subscribe({
              next: () => {
                  alert('Matrícula removida com sucesso!');
                  this.reloadWorkshop();
              },
              error: (err) => {
                  console.error('Erro ao remover matrícula', err);
                  alert('Erro ao remover matrícula.');
              }
          });
      }
  }

  managePresences(session: WorkshopSession) {
      const dialogRef = this.dialog.open<number[]>(WorkshopPresenceDialogComponent, {
          data: {
              session: session,
              enrolledStudents: this.workshop().enrolledStudents
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
                  }
              });
          }
      });
  }

  reloadWorkshop() {
      this.workshopService.getWorkshopById(this.workshop().id).subscribe(w => {
          this.workshop.set(w);
      });
  }
}
