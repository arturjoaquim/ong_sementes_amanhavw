import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { StudentFilters } from '../../types/student-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { StudentFilterDialog } from '../student-filter-dialog/student-filter-dialog.component';
import { StudentService } from '../../services/student.service';
import { StudentPreview } from '../../types/student-preview.type';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  imports: [
    LucideAngularModule,
    BadgeComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  standalone: true,
})
export class StudentSearchComponent {
  @Output() searchCompleted = new EventEmitter<StudentPreview[]>();

  icons = {
    search: Search,
    filter: Filter,
  };

  dialog = inject(Dialog);
  studentService = inject(StudentService);
  nameSearchFilter = new FormControl('');

  filters = signal<StudentFilters>({
    studentName: '',
    guardianName: '',
    status: '',
    minAge: undefined,
    maxAge: undefined,
  });

  openDialog() {
    const dialogRef = this.dialog.open<StudentFilters | undefined>(StudentFilterDialog, {
      data: { filters: this.filters() },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.filters.set(result);
        this.nameSearchFilter.setValue(result.studentName || '');
        this.search(this.filters());
      }
    });
  }

  searchByName() {
    this.filters.update((filters) => ({
      ...filters,
      guardianName: '',
      status: '',
      minAge: undefined,
      maxAge: undefined,
      studentName: this.nameSearchFilter.value || '',
    }));
    this.search(this.filters());
  }

  private search(filters: StudentFilters) {
    this.studentService.searchStudentsPreview(filters).subscribe((students) => {
      this.searchCompleted.emit(students);
    });
  }

  resetFilters() {
    this.nameSearchFilter.reset();
    this.filters.set({
      studentName: '',
      guardianName: '',
      status: '',
      minAge: undefined,
      maxAge: undefined,
    });
    this.searchCompleted.emit([]);
  }

  get activeFilterCount() {
    const { studentName, ...otherFilters } = this.filters();
    const otherFiltersCount = Object.values(otherFilters).filter(
      (value) => value !== undefined && value !== '' && value !== 'all',
    ).length;
    return (studentName ? 1 : 0) + otherFiltersCount;
  }

  get studentName() {
    return this.filters().studentName;
  }

  get guardianName() {
    return this.filters().guardianName;
  }

  get status() {
    return this.filters().status;
  }

  get minAge() {
    return this.filters().minAge;
  }

  get maxAge() {
    return this.filters().maxAge;
  }
}
