
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search, Plus } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { WorkshopFilters } from '../../types/workshop-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { WorkshopFilterDialogComponent } from '../workshop-filter-dialog/workshop-filter-dialog.component';
import { Workshop } from '../../types/workshop.type';
import { initialWorkshops } from '../../services/workshop.service';

@Component({
  selector: 'app-workshop-search',
  templateUrl: './workshop-search.component.html',
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
export class WorkshopSearchComponent {
  @Output() searchCompleted = new EventEmitter<Workshop[]>();
  @Output() createWorkshop = new EventEmitter<void>();

  icons = {
    search: Search,
    plus: Plus,
    filter: Filter,
  };

  dialog = inject(Dialog);
  nameSearchFilter = new FormControl('');

  filters = signal({
    nameSearch: '',
    educatorSearch: '',
    type: 'all',
    status: 'all',
  });

  onAddWorkshop() {
    this.createWorkshop.emit();
  }

  openDialog() {
    const dialogRef = this.dialog.open<WorkshopFilters | undefined>(WorkshopFilterDialogComponent, {
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
      educatorSearch: '',
      type: 'all',
      status: 'all',
      nameSearch: this.nameSearchFilter.value || '',
    }));
    this.search(this.filters());
  }

  private search(filters: WorkshopFilters) {
    const filteredWorkshops = this.searchWorkshops(filters);
    this.searchCompleted.emit(filteredWorkshops);
  }

  private searchWorkshops(filters: WorkshopFilters): Workshop[] {
    let workshops = initialWorkshops;

    if (filters.nameSearch) {
      workshops = workshops.filter((w) =>
        w.name.toLowerCase().includes(filters.nameSearch.toLowerCase())
      );
    }

    if (filters.educatorSearch) {
      workshops = workshops.filter((w) =>
        w.educatorName.toLowerCase().includes(filters.educatorSearch.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      workshops = workshops.filter((w) => w.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      workshops = workshops.filter((w) => w.type === filters.type);
    }

    return workshops;
  }

  resetFilters() {
    this.nameSearchFilter.reset();
    this.filters.set({
      nameSearch: '',
      educatorSearch: '',
      type: 'all',
      status: 'all',
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

  get educatorSearch() {
    return this.filters().educatorSearch;
  }

  get type() {
    return this.filters().type;
  }

  get status() {
    return this.filters().status;
  }
}
