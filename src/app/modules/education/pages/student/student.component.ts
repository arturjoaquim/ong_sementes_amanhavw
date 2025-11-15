import { Component } from '@angular/core';
import { LucideAngularModule, Users } from 'lucide-angular';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { Student } from '../../types/student.type';

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

  students: Student[] = [];

  showListResult(students: Student[]) {
    this.students = students;
  }

  showStudentDetails(student: Student) {
    console.log(student);
  }
}
