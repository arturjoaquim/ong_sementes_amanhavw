
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
import { Student } from '../../types/student.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-form-dialog',
  templateUrl: './student-form-dialog.component.html',
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
export class StudentFormDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<Student>>(DialogRef<Student>);

  studentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(25)]),
    cpf: new FormControl(''),
    race: new FormControl(''),
    placeOfBirth: new FormControl(''),
    fatherName: new FormControl(''),
    motherName: new FormControl(''),
    grade: new FormControl('', [Validators.required]),
    guardian: new FormControl('', [Validators.required]),
    guardianPhone: new FormControl('', [Validators.required]),
    enrollmentDate: new FormControl('', [Validators.required]),
    enrollmentOrigin: new FormControl(''),
    accompaniedStatus: new FormControl(''),
    status: new FormControl<'active' | 'inactive' | 'graduated'>('active', [Validators.required]),
  });

  isEditMode = false;

  ngOnInit(): void {
    if (this.data?.student) {
      this.isEditMode = true;
      this.studentForm.patchValue(this.data.student);
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const student: Partial<Student> = {
        ...formValue,
        id: this.data?.student?.id || `STU-${Date.now()}`,
        avatar: this.data?.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formValue.name}`,
        attendance: this.data?.student?.attendance || 0,
      } as Partial<Student>;
      
      this.dialogRef.close(student as Student);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
