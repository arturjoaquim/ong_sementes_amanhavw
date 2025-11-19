import { Component, inject } from '@angular/core';
import { LucideAngularModule, UserPlus, Users } from 'lucide-angular';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { Student } from '../../types/student.type';
import { Dialog } from '@angular/cdk/dialog';
import { StudentFormDialogComponent } from '../../components/student-form-dialog/student-form-dialog.component';
import { StudentService } from '../../services/student.service';
import { StudentDetailDialogComponent } from '../../components/student-detail-dialog/student-detail-dialog.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StudentPreviewData } from '../../types/preview-student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  imports: [LucideAngularModule, StudentSearchComponent, StudentListComponent, ButtonComponent],
  standalone: true,
})
export class StudentComponent {
  icons = {
    users: Users,
    userPlus: UserPlus,
  };

  dialog = inject(Dialog);
  studentService = inject(StudentService);

  students: StudentPreviewData[] = []; // TODO: Transformar em signal para respeitar reatividade

  setStudentPreviewList(students: StudentPreviewData[]) {
    this.students = students;
  }

  showStudentDetails(studentPreview: StudentPreviewData) {
    this.studentService.getStudentById(studentPreview.id).subscribe((student: Student) => {
      this.dialog.open(StudentDetailDialogComponent, {
        data: { student },
        width: '90vw',
        maxWidth: '1200px',
      });
    });
  }

  handleCreateStudent(student: Student | undefined) {
    // TODO: Definir nome mais semantico
    const dialogRef = this.dialog.open<Student>(StudentFormDialogComponent, {
      data: { student },
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        if (student) {
          this.studentService.updateStudent(result);
        } else {
          this.studentService.createStudent(result);
        }
      }
    });
  }
}
