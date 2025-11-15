import { Component, inject } from '@angular/core';
import { LucideAngularModule, Users } from 'lucide-angular';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { Student } from '../../types/student.type';
import { Dialog } from '@angular/cdk/dialog';
import { StudentDetailDialogComponent } from '../../components/student-detail-dialog/student-detail-dialog.component';
import { StudentFormDialogComponent } from '../../components/student-form-dialog/student-form-dialog.component';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  imports: [LucideAngularModule, StudentSearchComponent, StudentListComponent],
  standalone: true,
})
export class StudentComponent {
  icons = {
    users: Users,
  };

  dialog = inject(Dialog);
  studentService = inject(StudentService);

  students: Student[] = [];

  showListResult(students: Student[]) {
    this.students = students;
  }

  showStudentDetails(student: Student) {
    this.dialog.open(StudentDetailDialogComponent, {
      data: { student },
      width: '90vw',
      maxWidth: '1200px',
    });
  }

  handleCreateStudent(student: Student | undefined) {
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
