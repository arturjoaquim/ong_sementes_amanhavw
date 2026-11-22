import { Component, OnInit, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../types/form-field.type';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submitted.emit(this.form.value)" id="dynamic-form">
      <div class="grid grid-cols-2 gap-x-4 gap-y-3">
        @for (field of formConfig(); track field.name) {
          <div class="flex flex-col">
            <label [for]="field.name" class="app-label text-sm font-medium text-gray-700 mb-1">
              {{ field.label }}
            </label>

            @switch (field.type) {
              @case ('text') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  class="app-input"
                />
              }
              @case ('date') {
                <input
                  [id]="field.name"
                  type="date"
                  [formControlName]="field.name"
                  class="form-input app-input"
                />
              }
              @case ('select') {
                <ng-select
                  [id]="field.name"
                  class="app-select"
                  [formControlName]="field.name"
                  bindLabel="viewValue"
                  bindValue="value"
                  [items]="field.options ?? []"
                  [searchable]="false"
                  [clearable]="false"
                >
                </ng-select>
              }
            }
          </div>
        }
      </div>
    </form>
  `,
})
export class DynamicFormComponent implements OnInit {
  formConfig = input.required<FormField[]>();
  initialData = input<any>({});
  submitted = output<any>();

  public form!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    const controls: Record<string, any> = {};
    const data = this.initialData();
    for (const field of this.formConfig()) {
      const validators = field.required ? [Validators.required] : [];
      let value = data ? data[field.name] : '';

      if (field.type === 'date' && value instanceof Date) {
        value = this.formatDateForInput(value);
      }

      controls[field.name] = [value, validators];
    }
    this.form = this.fb.group(controls);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
