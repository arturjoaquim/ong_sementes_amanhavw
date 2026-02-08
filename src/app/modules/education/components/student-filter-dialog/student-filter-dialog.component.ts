import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { StudentFilters } from '../../types/student-filters.type';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-student-filter-dialog',
  templateUrl: './student-filter-dialog.component.html',
  standalone: true,
  imports: [
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgSelectModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', density: 'dense' },
    },
  ],
})
export class StudentFilterDialog implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<StudentFilters>>(DialogRef<StudentFilters>);

  studentFilters = new FormGroup({
    nameSearch: new FormControl(''),
    guardianSearch: new FormControl(''),
   // gradeLevel: new FormControl('all'),
    status: new FormControl(''),
    ageMin: new FormControl(''),
    ageMax: new FormControl(''),
  });

  ngOnInit(): void {
    this.updateFilters(this.data.filters);
  }

  updateFilters(filters: StudentFilters) {
    this.studentFilters.patchValue(filters);
  }

  resetFilters() {
    this.studentFilters.reset();
  }

  onSubmit() {
    this.dialogRef.close(this.studentFilters.value as StudentFilters);
  }
}
