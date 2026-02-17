import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { WorkshopService } from '../../services/workshop.service';
import { CreateWorkshopSessionDTO } from '../../types/dtos/create-workshop-session.dto';
import { WorkshopPreview } from '../../types/workshop-preview.type';
import { AuthService } from '../../../../core/services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Observable, Subject, of, concat } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { StudentPreview } from '../../types/student-preview.type';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-workshop-session-form-dialog',
  templateUrl: './workshop-session-form-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    LucideAngularModule
  ],
})
export class WorkshopSessionFormDialogComponent implements OnInit {
  data = inject<{ workshopId?: number }>(DIALOG_DATA);
  dialogRef = inject<DialogRef<boolean>>(DialogRef);
  private workshopService = inject(WorkshopService);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private studentService = inject(StudentService);

  icons = {
    trash: Trash2
  };

  sessionForm = new FormGroup({
    workshopId: new FormControl<number | null>(null, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    attendanceListLink: new FormControl(''),
    participants: new FormControl<number[]>([]),
  });

  workshops: WorkshopPreview[] = [];
  currentEducatorId: number | null = null;

  students$!: Observable<StudentPreview[]>;
  studentInput$ = new Subject<string>();
  loadingStudents = false;

  selectedStudents: StudentPreview[] = [];
  selectedStudentControl = new FormControl(null);

  ngOnInit() {
    // Carregar oficinas para o select
    this.workshopService.getWorkshopsPreview().subscribe((data) => {
      this.workshops = data;
      if (this.data?.workshopId) {
        this.sessionForm.patchValue({ workshopId: this.data.workshopId });
        this.sessionForm.get('workshopId')?.disable();
      }
    });

    // Buscar ID do educador logado
    const user = this.authService.getUser();
    if (user) {
      this.employeeService.getEmployeeByUserId(user.id).subscribe({
        next: (employee) => {
          this.currentEducatorId = employee.id;
        },
        error: (err) => {
          console.error('Erro ao buscar funcionário', err);
          // Tratar erro
        },
      });
    }

    this.loadStudents();

    this.selectedStudentControl.valueChanges.subscribe((student: any) => {
        if (student) {
            this.addStudent(student as StudentPreview);
            this.selectedStudentControl.setValue(null, { emitEvent: false });
        }
    });
  }

  private loadStudents() {
    this.students$ = concat(
      of([]),
      this.studentInput$.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => this.loadingStudents = true),
        switchMap(term => {
          if (!term || term.length < 3) {
            this.loadingStudents = false;
            return of([]);
          }
          return this.studentService.searchStudentsPreview({ nameSearch: term, limit: 10 }).pipe(
            catchError(() => of([])),
            tap(() => this.loadingStudents = false)
          );
        })
      )
    );
  }

  addStudent(student: StudentPreview) {
      if (!this.selectedStudents.find(s => s.id === student.id)) {
          this.selectedStudents.push(student);
          this.updateParticipantsControl();
      }
  }

  removeStudent(studentId: number) {
      this.selectedStudents = this.selectedStudents.filter(s => s.id !== studentId);
      this.updateParticipantsControl();
  }

  private updateParticipantsControl() {
      const ids = this.selectedStudents.map(s => s.id);
      this.sessionForm.get('participants')?.setValue(ids);
  }

  onSubmit() {
    if (this.sessionForm.valid && this.currentEducatorId) {
      const formValue = this.sessionForm.getRawValue();

      const dto: CreateWorkshopSessionDTO = {
        workshopId: formValue.workshopId!,
        description: formValue.description!,
        attendanceListLink: formValue.attendanceListLink || '',
        responsibleEducatorId: this.currentEducatorId,
        studentIds: formValue.participants || []
      };

      this.workshopService.createSession(dto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erro ao criar sessão', err);
          alert('Erro ao criar sessão.');
        },
      });
    } else if (!this.currentEducatorId) {
        alert('Não foi possível identificar o educador logado.');
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
