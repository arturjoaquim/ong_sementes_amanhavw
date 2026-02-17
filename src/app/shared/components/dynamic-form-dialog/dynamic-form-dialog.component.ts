import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormField } from '../../types/form-field.type';
import { DynamicFormComponent } from './dynamic-form.component';
import { ButtonDirective } from '../../directives/button.directive';

export interface DynamicFormDialogData {
  title: string;
  formConfig: FormField[];
  initialData: any;
}

@Component({
  selector: 'app-dynamic-form-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DynamicFormComponent, ButtonDirective],
  template: `
    <div class="bg-white rounded-lg shadow-xl p-6 w-[600px]">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ data.title }}</h3>

      <app-dynamic-form
        #dynamicForm
        [formConfig]="data.formConfig"
        [initialData]="data.initialData"
        (submitted)="save($event)"
      ></app-dynamic-form>

      <div class="flex justify-end gap-3 mt-6">
        <button appButton variant="outline" type="button" (click)="close()">Cancelar</button>
        <button appButton type="submit" form="dynamic-form" [disabled]="dynamicForm.form!.invalid">
          Salvar
        </button>
      </div>
    </div>
  `,
})
export class DynamicFormDialogComponent {
  @ViewChild('dynamicForm') dynamicForm!: DynamicFormComponent;
  public dialogRef = inject(DialogRef<any>);
  public data: DynamicFormDialogData = inject(DIALOG_DATA);

  save(formData: any): void {
    this.dialogRef.close(formData);
  }

  close(): void {
    this.dialogRef.close();
  }
}
