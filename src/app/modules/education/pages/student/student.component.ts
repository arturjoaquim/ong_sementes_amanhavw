import { Component, inject } from '@angular/core';
import { LucideAngularModule, UserPlus, Users } from 'lucide-angular';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { Student } from '../../types/student.type';
import { Dialog } from '@angular/cdk/dialog';
import { StudentService } from '../../services/student.service';
import { StudentDetailDialogComponent } from '../../components/student-detail-dialog/student-detail-dialog.component';
import { StudentPreview } from '../../types/student-preview.type';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { StudentCreationDialogComponent } from '../../components/student-creation-dialog/student-creation-dialog.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  imports: [LucideAngularModule, StudentSearchComponent, StudentListComponent, ButtonDirective],
  standalone: true,
})
export class StudentComponent {
  icons = {
    users: Users,
    userPlus: UserPlus,
  };

  dialog = inject(Dialog);
  studentService = inject(StudentService);

  students: StudentPreview[] = []; // TODO: Transformar em signal para respeitar reatividade

  setStudentPreviewList(students: StudentPreview[]) {
    this.students = students;
  }

  showStudentDetails(studentPreview: StudentPreview) {
    this.studentService.getStudentDetailsById(studentPreview.id).subscribe((student: Student) => {
      this.dialog.open(StudentDetailDialogComponent, {
        data: { student },
        width: '90vw',
        maxWidth: '1200px',
      });
    });
  }

  handleCreateStudent(student: Student | undefined) {
    // TODO: Definir nome mais semantico
    const dialogRef = this.dialog.open<void>(StudentCreationDialogComponent, {
      data: { student },
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe(() => {
      // TODO: Recarregar lista se necessário, ou deixar que o usuário filtre novamente
      // O ideal seria emitir um evento para o StudentSearchComponent recarregar
    });
  }
}
