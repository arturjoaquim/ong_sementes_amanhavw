import { Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { EmployeeService } from '../../services/employee.service';
import { CreateEmployeeDTO } from '../../types/dtos/create-employee.dto';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../../../../shared/components/tab/tabs.component';
import { Tab } from '../../../../shared/types/tab.type';
import {DocumentTypeMap, PositionType, PositionTypeMap} from '../../../../shared/utils/lookup.enums';

@Component({
  selector: 'app-employee-creation-dialog',
  templateUrl: './employee-creation-dialog.component.html',
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
    NgSelectComponent,
    TabsComponent
  ],
})
export class EmployeeCreationDialogComponent implements OnInit {
  dialogRef = inject<DialogRef<boolean>>(DialogRef);
  private employeeService = inject(EmployeeService);

  positionsOptions!: PositionType[];

  tabs: Tab[] = [
    { id: 'personal', label: 'Dados Pessoais' },
    { id: 'address', label: 'Endereço' },
    { id: 'contact', label: 'Contato' },
    { id: 'documents', label: 'Documentos' },
  ];
  activeTab = 'personal';

  employeeForm = new FormGroup({
    personal: new FormGroup({
        name: new FormControl('', [Validators.required]),
        birthDate: new FormControl('', [Validators.required]),
        positionId: new FormControl(null, [Validators.required]),
        motherName: new FormControl(''),
        fatherName: new FormControl(''),
        sexId: new FormControl(null),
        raceId: new FormControl(null),
        naturalnessId: new FormControl(null),
    }),
    address: new FormGroup({
        street: new FormControl(''),
        number: new FormControl(''),
        complement: new FormControl(''),
        neighborhood: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zipCode: new FormControl(''),
    }),
    contact: new FormGroup({
        email: new FormControl('', [Validators.email]),
        phone: new FormControl(''),
        mobilePhone: new FormControl(''),
        hasWhatsApp: new FormControl(false),
    }),
    documents: new FormArray([
        new FormGroup({
          documentTypeId: new FormControl(1), // CPF
          documentNumber: new FormControl(''),
        }),
        new FormGroup({
          documentTypeId: new FormControl(2), // RG
          documentNumber: new FormControl(''),
        }),
    ]),
  });

  ngOnInit() {
      this.positionsOptions = Object.values(PositionTypeMap).map((position) => (
        {id: position.id, name: position.name}));
  }

  onTabChange(tabId: string) {
    this.activeTab = tabId;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.getRawValue();

      const dto: any = {
          person: {
              personName: formValue.personal.name!,
              birthDate: new Date(formValue.personal.birthDate!),
              motherName: formValue.personal.motherName || '',
              fatherName: formValue.personal.fatherName || '',
              sexId: formValue.personal.sexId || null, // Ajustar se 0 for inválido
              raceId: formValue.personal.raceId || null,
              naturalnessId: formValue.personal.naturalnessId || null,
              address: {
                  street: formValue.address.street || '',
                  streetNumber: formValue.address.number || '',
                  complement: formValue.address.complement || '',
                  neighborhood: formValue.address.neighborhood || '',
                  city: formValue.address.city || '',
                  uf: formValue.address.state || '',
                  cep: formValue.address.zipCode || ''
              },
              contact: {
                  email: formValue.contact.email || '',
                  telephone: formValue.contact.phone || '',
                  mobilePhone: formValue.contact.mobilePhone || '',
                  hasWhatsApp: formValue.contact.hasWhatsApp || false
              },
              education: null as any, // Se não tiver aba de educação
              documents: formValue.documents.map((doc: any) => ({
                  id: 0,
                  documentTypeId: doc.documentTypeId,
                  number: doc.documentNumber,
                  active: true
              }))
          },
          positionId: formValue.personal.positionId!
      };

      this.employeeService.createEmployee(dto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erro ao criar funcionário', err);
          alert('Erro ao criar funcionário.');
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getDocumentTypeName(id: number) {
    return DocumentTypeMap[id]?.descricao || 'Documento';
  }
}
