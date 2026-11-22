import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Filter, LucideAngularModule, Search, Plus, CalendarPlus } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { WorkshopFilters } from '../../types/workshop-filters.type';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { WorkshopFilterDialogComponent } from '../workshop-filter-dialog/workshop-filter-dialog.component';
import { WorkshopPreview } from '../../types/workshop-preview.type';
import { WorkshopService } from '../../services/workshop.service';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { ActivatedRoute, Router } from '@angular/router';

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
export class WorkshopSearchComponent implements OnInit {
  searchCompleted = output<WorkshopPreview[]>();
  createWorkshop = output<void>();
  createSession = output<void>();

  icons = {
    search: Search,
    plus: Plus,
    filter: Filter,
    calendarPlus: CalendarPlus,
  };

  dialog = inject(Dialog);
  workshopService = inject(WorkshopService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  nameSearchFilter = new FormControl('');

  filters = signal<WorkshopFilters>({
    nameSearch: '',
    educatorSearch: '',
    type: 'all',
    status: 'all',
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const nameSearch = params['nameSearch'] || '';
      const educatorSearch = params['educatorSearch'] || '';
      const type = params['type'] || 'all';
      const status = params['status'] || 'all';

      this.filters.set({
        nameSearch,
        educatorSearch,
        type,
        status,
      });

      this.nameSearchFilter.setValue(nameSearch);
      this.search(this.filters(), false);
    });
  }

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

  private updateQueryParams(filters: WorkshopFilters) {
    const queryParams: Record<string, string | null> = {};
    if (filters.nameSearch) queryParams['nameSearch'] = filters.nameSearch;
    if (filters.educatorSearch) queryParams['educatorSearch'] = filters.educatorSearch;
    if (filters.type && filters.type !== 'all') queryParams['type'] = filters.type;
    if (filters.status && filters.status !== 'all') queryParams['status'] = filters.status;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  search(filters: WorkshopFilters = this.filters(), syncUrl = true) {
    if (syncUrl) {
      this.updateQueryParams(filters);
    }
    this.workshopService.getWorkshopsPreview().subscribe((previews) => {
      let filtered = previews;
      if (filters.nameSearch) {
        filtered = filtered.filter((w) =>
          w.name.toLowerCase().includes(filters.nameSearch!.toLowerCase()),
        );
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
    this.search(this.filters(), false);
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
