import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search, Plus } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { EmployeeFilters } from '../../types/employee-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EmployeeService } from '../../services/employee.service';
import { EmployeePreview } from '../../types/employee-preview.type';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { EmployeeFilterDialogComponent } from '../employee-filter-dialog/employee-filter-dialog.component';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
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
export class EmployeeSearchComponent {
  @Output() searchCompleted = new EventEmitter<EmployeePreview[]>();
  @Output() createEmployee = new EventEmitter<void>();

  icons = {
    search: Search,
    plus: Plus,
    filter: Filter,
  };

  dialog = inject(Dialog);
  employeeService = inject(EmployeeService);
  nameSearchFilter = new FormControl('');

  filters = signal<EmployeeFilters>({
    nameSearch: '',
    positionId: 'all',
  });

  onAddEmployee() {
    this.createEmployee.emit();
  }

  openDialog() {
    const dialogRef = this.dialog.open<EmployeeFilters | undefined>(EmployeeFilterDialogComponent, {
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
      positionId: 'all',
      nameSearch: this.nameSearchFilter.value || '',
    }));
    this.search(this.filters());
  }

  private search(filters: EmployeeFilters) {
    this.employeeService.searchEmployees(filters).subscribe((employees) => {
      // Filtragem básica no front se o back retornar tudo
      let filtered = employees;
      if (filters.nameSearch) {
          filtered = filtered.filter(e => e.name.toLowerCase().includes(filters.nameSearch!.toLowerCase()));
      }
      this.searchCompleted.emit(filtered);
    });
  }

  resetFilters() {
    this.nameSearchFilter.reset();
    this.filters.set({
      nameSearch: '',
      positionId: 'all',
    });
    this.search(this.filters());
  }

  get activeFilterCount() {
    const { nameSearch, ...otherFilters } = this.filters();
    const otherFiltersCount = Object.values(otherFilters).filter(
      (value) => value && value !== 'all',
    ).length;
    return (nameSearch ? 1 : 0) + otherFiltersCount;
  }
}
