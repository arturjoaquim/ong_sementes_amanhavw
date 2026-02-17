import { Component, inject, Input, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../types/student.type';
import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardCheck,
  LucideIconData,
  School,
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SectionHeaderComponent } from './section-header.component';
import { DetailFieldComponent } from './detail-field.component';
import {
  EducationStatusMap,
  PeriodMap,
  SchoolGradeMap,
  SchoolGrade,
  Period,
  EducationStatus,
} from '../../../../shared/utils/lookup.enums';
import { FormField } from '../../../../shared/types/form-field.type';
import { Dialog } from '@angular/cdk/dialog';
import { DynamicFormDialogComponent } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { StudentService } from '../../services/student.service';

interface Option {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-student-academic-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SectionHeaderComponent,
    DetailFieldComponent,
    LucideAngularModule,
  ],
  templateUrl: './student-academic-detail.component.html',
})
export class StudentAcademicDetailComponent implements OnInit {
  @Input({ required: true }) student!: WritableSignal<Student>;
  dialog = inject(Dialog);
  private studentService = inject(StudentService);

  schoolGradeOptions!: Option[];
  periodOptions!: Option[];
  educationStatusOptions!: Option[];

  icons: Record<string, LucideIconData> = {
    school: School,
    building: Building2,
    bookOpen: BookOpen,
    clipboardCheck: ClipboardCheck,
    calendar: Calendar,
  };

  ngOnInit(): void {
    this.schoolGradeOptions = Object.values(SchoolGrade).map((grade) => ({
      value: grade.id,
      viewValue: grade.descricao,
    }));

    this.periodOptions = Object.values(Period).map((period) => ({
      value: period.id,
      viewValue: period.descricao,
    }));

    this.educationStatusOptions = Object.values(EducationStatus).map((status) => ({
      value: status.id,
      viewValue: status.descricao,
    }));
  }

  editAcademicData() {
    const formConfig: FormField[] = [
      { name: 'institution', label: 'Nome da Instituição', type: 'text', required: true },
      {
        name: 'educationLevelId',
        label: 'Ano letivo',
        type: 'select',
        required: true,
        options: this.schoolGradeOptions,
      },
      {
        name: 'periodId',
        label: 'Período',
        type: 'select',
        required: true,
        options: this.periodOptions,
      },
      {
        name: 'educationStatusId',
        label: 'Status',
        type: 'select',
        required: true,
        options: this.educationStatusOptions,
      },
    ];

    const dialogRef = this.dialog.open<any>(DynamicFormDialogComponent, {
      data: { title: 'Editar Dados Acadêmicos', formConfig, initialData: this.education },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const currentStudent = this.student();
        const updatedStudent = {
          ...currentStudent,
          personData: {
            ...currentStudent.personData,
            education: {
              id: currentStudent.personData.education?.id || 0,
              institution: result.institution,
              educationLevelId: result.educationLevelId,
              periodId: result.periodId,
              educationStatusId: result.educationStatusId
            },
          },
        };

        // Chama o serviço para persistir a atualização
        this.studentService.updateStudent(updatedStudent).subscribe({
            next: () => {
                console.log('Estudante atualizado com sucesso');
                alert('Dados atualizados com sucesso!');
                this.student.set(updatedStudent);
            },
            error: (err) => {
                console.error('Erro ao atualizar estudante', err);
                alert('Erro ao atualizar dados. Tente novamente.');
            }
        });
      }
    });
  }

  get education() {
    return this.student().personData.education;
  }

  get studyLevel(): string {
    if (!this.education?.educationLevelId) return 'N/A';
    return SchoolGradeMap[this.education.educationLevelId]?.descricao || 'N/A';
  }

  get academicPeriod(): string {
    if (!this.education?.periodId) return 'N/A';
    return PeriodMap[this.education.periodId]?.descricao || 'N/A';
  }

  get educationStatus(): string {
    if (!this.education?.educationStatusId) return 'N/A';
    return EducationStatusMap[this.education.educationStatusId]?.descricao || 'N/A';
  }
}
