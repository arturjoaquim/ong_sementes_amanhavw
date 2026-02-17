import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Workshop } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { NgSelectComponent } from '@ng-select/ng-select';
import { StudentService } from '../../services/student.service';
import { Observable, Subject, of, concat, forkJoin } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { StudentPreview } from '../../types/student-preview.type';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { Student } from '../../types/student.type';
import { AuthService } from '../../../../core/services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-workshop-form-dialog',
  templateUrl: './workshop-form-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LucideAngularModule
  ]
})
export class WorkshopFormDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<Workshop>>(DialogRef<Workshop>);

  workshopForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    enrollmentLimit: new FormControl(20, [Validators.required]),
    active: new FormControl(true, [Validators.required])
  });

  isEditMode = false;

  ngOnInit(): void {
    if (this.data?.workshop) {
      this.isEditMode = true;
      this.workshopForm.patchValue(this.data.workshop);
    }
  }

  onSubmit() {
    if (this.workshopForm.valid) {
      const formValue = this.workshopForm.value;

      const workshop: Partial<Workshop> = {
        id: this.data?.workshop?.id,
        name: formValue.name || '',
        enrollmentLimit: formValue.enrollmentLimit || 0,
        active: formValue.active || false,
        sessions: [] // Sessões são gerenciadas separadamente
      };

      this.dialogRef.close(workshop as Workshop);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
