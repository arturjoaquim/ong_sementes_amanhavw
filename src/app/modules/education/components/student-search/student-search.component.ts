import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search, UserPlus } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StudentFilters } from '../../types/student-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { StudentFilterDialog } from '../student-filter-dialog/student-filter-dialog.component';
import { Student } from '../../types/student.type';
import { initialStudents } from '../../services/student.service';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  imports: [
    LucideAngularModule,
    BadgeComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  standalone: true,
})
export class StudentSearchComponent {
  @Output() searchCompleted = new EventEmitter<Student[]>();
  @Output() createStudent = new EventEmitter<void>();

  icons = {
    search: Search,
    userPlus: UserPlus,
    filter: Filter,
  };

  onAddStudent() {
    this.createStudent.emit();
  }
  dialog = inject(Dialog);
  nameSearchFilter = new FormControl('');

  filters = signal({
    nameSearch: '',
    guardianSearch: '',
    gradeLevel: 'all',
    status: 'all',
    ageMin: '',
    ageMax: '',
  });

  openDialog() {
    const dialogRef = this.dialog.open<StudentFilters | undefined>(StudentFilterDialog, {
      data: { filters: this.filters() },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.filters.set(result);
        this.nameSearchFilter.setValue(result.nameSearch || '');
        this.search(this.filters());
      }
    });
  }

  searchByName() {
    this.filters.update((filters) => ({
      ...filters,
      guardianSearch: '',
      gradeLevel: 'all',
      status: 'all',
      ageMin: '',
      ageMax: '',
      nameSearch: this.nameSearchFilter.value || '',
    }));
    this.search(this.filters());
  }

  private search(filters: StudentFilters) {
    const filteredStudents = this.searchStudents(filters);
    this.searchCompleted.emit(filteredStudents);
  }

  private searchStudents(filters: StudentFilters): Student[] {
    let students = initialStudents;

    if (filters.nameSearch) {
      students = students.filter((s) =>
        s.name.toLowerCase().includes(filters.nameSearch.toLowerCase())
      );
    }

    if (filters.guardianSearch) {
      students = students.filter((s) =>
        s.guardian.toLowerCase().includes(filters.guardianSearch.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      students = students.filter((s) => s.status === filters.status);
    }

    if (filters.gradeLevel && filters.gradeLevel !== 'all') {
      students = students.filter((s) => s.grade === filters.gradeLevel);
    }

    if (filters.ageMin) {
      students = students.filter((s) => s.age >= parseInt(filters.ageMin));
    }

    if (filters.ageMax) {
      students = students.filter((s) => s.age <= parseInt(filters.ageMax));
    }

    return students;
  }

  resetFilters() {
    this.nameSearchFilter.reset();
    this.filters.set({
      nameSearch: '',
      guardianSearch: '',
      gradeLevel: 'all',
      status: 'all',
      ageMin: '',
      ageMax: '',
    });
    this.searchCompleted.emit([]);
  }

  get activeFilterCount() {
    const { nameSearch, ...otherFilters } = this.filters();
    const otherFiltersCount = Object.values(otherFilters).filter(
      (value) => value && value !== 'all',
    ).length;
    return (nameSearch ? 1 : 0) + otherFiltersCount;
  }

  get nameSearch() {
    return this.filters().nameSearch;
  }

  get guardianSearch() {
    return this.filters().guardianSearch;
  }

  get gradeLevel() {
    return this.filters().gradeLevel;
  }

  get status() {
    return this.filters().status;
  }

  get ageMin() {
    return this.filters().ageMin;
  }

  get ageMax() {
    return this.filters().ageMax;
  }
}
