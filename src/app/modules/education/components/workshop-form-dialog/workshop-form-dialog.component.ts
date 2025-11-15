
import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Workshop } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';

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
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', density: 'comfortable' },
    },
  ],
})
export class WorkshopFormDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<Workshop>>(DialogRef<Workshop>);

  workshopForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    educatorName: new FormControl('', [Validators.required]),
    maxParticipants: new FormControl(15, [Validators.required, Validators.min(1)]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(''),
    status: new FormControl<'active' | 'inactive' | 'completed'>('active', [Validators.required]),
    attendanceListUrl: new FormControl(''),
  });

  workshopTypes = ['Artes', 'Música', 'Teatro', 'Tecnologia', 'Esportes', 'Literatura', 'Gastronomia'];
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
        ...formValue,
        id: this.data?.workshop?.id || `WRK-${Date.now()}`,
        educatorId: this.data?.workshop?.educatorId || `EDU-${Date.now()}`,
        participants: this.data?.workshop?.participants || [],
        schedule: this.data?.workshop?.schedule || [],
      } as Partial<Workshop>;
      
      this.dialogRef.close(workshop as Workshop);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
