import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eye, LucideAngularModule, Phone } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  AvatarComponent,
  AvatarFallbackComponent,
} from '../../../../shared/components/avatar/avatar.component';
import { Student } from '../../types/student.type';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  standalone: true,
  imports: [
    LucideAngularModule,
    BadgeComponent,
    ButtonComponent,
    AvatarComponent,
    AvatarFallbackComponent,
  ],
})
export class StudentListComponent {
  icons = {
    phone: Phone,
    eye: Eye,
  };

  @Input() students: Student[] = [];
  @Output() viewStudentDetail = new EventEmitter<Student>();

  viewDetails(student: Student) {
    this.viewStudentDetail.emit(student);
  }

  getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'graduated':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-orange-600';
    return 'text-red-600';
  };
}
