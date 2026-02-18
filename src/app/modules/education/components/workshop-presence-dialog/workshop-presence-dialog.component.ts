import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { WorkshopParticipant, WorkshopSession } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface WorkshopPresenceDialogData {
  session: WorkshopSession;
  enrolledStudents: WorkshopParticipant[];
}

@Component({
  selector: 'app-workshop-presence-dialog',
  templateUrl: './workshop-presence-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class WorkshopPresenceDialogComponent implements OnInit {
  data = inject<WorkshopPresenceDialogData>(DIALOG_DATA);
  dialogRef = inject<DialogRef<number[]>>(DialogRef);

  presenceForm = new FormGroup({
    students: new FormArray<FormControl<boolean | null>>([])
  });

  ngOnInit() {
    const presentIds = new Set(this.data.session.presences?.map(p => p.studentId) || []);

    this.data.enrolledStudents.forEach(student => {
      const isPresent = presentIds.has(student.studentId);
      this.studentsArray.push(new FormControl(isPresent));
    });
  }

  get studentsArray(): FormArray<FormControl<boolean | null>> {
    return this.presenceForm.get('students') as FormArray<FormControl<boolean | null>>;
  }

  onSubmit() {
    const selectedIds: number[] = [];
    this.studentsArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedIds.push(this.data.enrolledStudents[index].studentId);
      }
    });
    this.dialogRef.close(selectedIds);
  }

  cancel() {
    this.dialogRef.close();
  }
}
