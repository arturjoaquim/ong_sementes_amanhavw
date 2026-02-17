import { Component, inject } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EmployeeFilters } from '../../types/employee-filters.type';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-employee-filter-dialog',
  templateUrl: './employee-filter-dialog.component.html',
  standalone: true,
  imports: [
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
  ],
})
export class EmployeeFilterDialogComponent {
  data = inject<{ filters: EmployeeFilters }>(DIALOG_DATA);
  dialogRef = inject<DialogRef<EmployeeFilters>>(DialogRef);

  filterForm = new FormGroup({
    nameSearch: new FormControl(this.data.filters.nameSearch || ''),
    positionId: new FormControl(this.data.filters.positionId || 'all'),
  });

  positions = [
    { id: 'all', name: 'Todos' },
    { id: 1, name: 'Coordenador' },
    { id: 2, name: 'Professor' },
    { id: 3, name: 'Assistente Social' },
    { id: 4, name: 'Psicólogo' },
    // Adicionar mais cargos conforme necessário ou buscar do backend
  ];

  applyFilters() {
    this.dialogRef.close(this.filterForm.value as EmployeeFilters);
  }

  cancel() {
    this.dialogRef.close();
  }
}
