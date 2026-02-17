import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search, Plus, CalendarPlus } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { WorkshopFilters } from '../../types/workshop-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { WorkshopFilterDialogComponent } from '../workshop-filter-dialog/workshop-filter-dialog.component';
import { WorkshopPreview } from '../../types/workshop-preview.type';
import { WorkshopService } from '../../services/workshop.service';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-workshop-search',
  templateUrl: './workshop-search.component.html',
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
export class WorkshopSearchComponent {
  @Output() searchCompleted = new EventEmitter<WorkshopPreview[]>();
  @Output() createWorkshop = new EventEmitter<void>();
  @Output() createSession = new EventEmitter<void>();

  icons = {
    search: Search,
    plus: Plus,
    filter: Filter,
    calendarPlus: CalendarPlus
  };

  dialog = inject(Dialog);
  workshopService = inject(WorkshopService);
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

  onAddSession() {
    this.createSession.emit();
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
    this.workshopService.getWorkshopsPreview().subscribe(previews => {
        let filtered = previews;
        if (filters.nameSearch) {
            filtered = filtered.filter(w => w.name.toLowerCase().includes(filters.nameSearch!.toLowerCase()));
        }
        this.searchCompleted.emit(filtered);
    });
  }

  resetFilters() {
    this.nameSearchFilter.reset();
    this.filters.set({
      nameSearch: '',
      educatorSearch: '',
      type: 'all',
      status: 'all',
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
