import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkshopFilters } from '../../types/workshop-filters.type';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-workshop-filter-dialog',
  templateUrl: './workshop-filter-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
})
export class WorkshopFilterDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<WorkshopFilters>>(DialogRef<WorkshopFilters>);

  workshopFilters = new FormGroup({
    nameSearch: new FormControl(''),
    educatorSearch: new FormControl(''),
    type: new FormControl('all'),
    status: new FormControl('all'),
  });

  workshopTypes = [
    'Artes',
    'Música',
    'Teatro',
    'Tecnologia',
    'Esportes',
    'Literatura',
    'Gastronomia',
  ];

  ngOnInit(): void {
    this.updateFilters(this.data.filters);
  }

  updateFilters(filters: WorkshopFilters) {
    this.workshopFilters.patchValue(filters);
  }

  resetFilters() {
    this.workshopFilters.reset({
      nameSearch: '',
      educatorSearch: '',
      type: 'all',
      status: 'all',
    });
  }

  onSubmit() {
    this.dialogRef.close(this.workshopFilters.value as WorkshopFilters);
  }
}
