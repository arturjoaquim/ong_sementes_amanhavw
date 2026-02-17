import { Component, inject, signal } from '@angular/core';
import {
  DialogComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EmployeeResponseDTO } from '../../types/dtos/employee-response.dto';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { LucideAngularModule, User, MapPin, Phone, FileText, Mail } from 'lucide-angular';
import { DocumentTypeMap, PositionTypeMap } from '../../../../shared/utils/lookup.enums';
import { EmployeeService } from '../../services/employee.service';
import { SectionHeaderComponent } from '../student-detail-dialog/section-header.component';
import { DynamicFormDialogComponent, DynamicFormDialogData } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { UpdateEmployeeDTO } from '../../types/dtos/update-employee.dto';

@Component({
  selector: 'app-employee-detail-dialog',
  templateUrl: './employee-detail-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    ButtonDirective,
    CardComponent,
    LucideAngularModule,
    SectionHeaderComponent
  ],
})
export class EmployeeDetailDialogComponent {
  data = inject<{ employee: EmployeeResponseDTO }>(DIALOG_DATA);
  dialogRef = inject<DialogRef<boolean>>(DialogRef);
  private dialog = inject(Dialog);
  private employeeService = inject(EmployeeService);

  employee = signal(this.data.employee);

  icons = {
    user: User,
    mapPin: MapPin,
    phone: Phone,
    fileText: FileText,
    mail: Mail
  };

  close() {
    this.dialogRef.close(false);
  }

  editData(section: string): void {
    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      personal: {
        title: 'Editar Dados Pessoais',
        initialData: {
            ...this.employee().person,
            name: this.employee().person.personName,
            positionId: this.employee().positionId
        },
        formConfig: [
          { name: 'name', label: 'Nome Completo', type: 'text', required: true },
          { name: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
          {
            name: 'positionId',
            label: 'Cargo',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Coordenador' },
              { value: 2, viewValue: 'Professor' },
              { value: 3, viewValue: 'Assistente Social' },
              { value: 4, viewValue: 'Psicólogo' },
            ],
            required: true,
          },
          { name: 'motherName', label: 'Nome da Mãe', type: 'text' },
          { name: 'fatherName', label: 'Nome do Pai', type: 'text' },
        ],
      },
      address: {
        title: 'Editar Endereço',
        initialData: {
            ...this.employee().person.address,
            number: this.employee().person.address?.streetNumber,
            state: this.employee().person.address?.uf,
            zipCode: this.employee().person.address?.cep
        },
        formConfig: [
          { name: 'street', label: 'Rua', type: 'text', required: true },
          { name: 'number', label: 'Número', type: 'text', required: true },
          { name: 'complement', label: 'Complemento', type: 'text' },
          { name: 'neighborhood', label: 'Bairro', type: 'text', required: true },
          { name: 'city', label: 'Cidade', type: 'text', required: true },
          { name: 'state', label: 'Estado', type: 'text', required: true },
          { name: 'zipCode', label: 'CEP', type: 'text', required: true },
        ],
      },
      contact: {
        title: 'Editar Contato',
        initialData: {
            ...this.employee().person.contact,
            phone: this.employee().person.contact?.telephone
        },
        formConfig: [
          { name: 'email', label: 'E-mail', type: 'text' },
          { name: 'phone', label: 'Telefone Fixo', type: 'text' },
          { name: 'mobilePhone', label: 'Celular', type: 'text' },
          {
            name: 'hasWhatsApp',
            label: 'Tem WhatsApp?',
            type: 'select',
            options: [
              { value: true, viewValue: 'Sim' },
              { value: false, viewValue: 'Não' },
            ],
          },
        ],
      },
    };

    if (editFormDataCatalog[section]) {
      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: editFormDataCatalog[section],
      });

      dialogRef.closed.subscribe((result: any) => {
        if (result) {
          let updateDto: UpdateEmployeeDTO = {};

          if (section === 'personal') {
              updateDto = {
                  person: {
                      personName: result.name,
                      birthDate: new Date(result.birthDate),
                      motherName: result.motherName,
                      fatherName: result.fatherName
                  },
                  positionId: result.positionId
              };
          } else if (section === 'address') {
              updateDto = {
                  person: {
                      address: {
                          street: result.street,
                          streetNumber: result.number,
                          complement: result.complement,
                          neighborhood: result.neighborhood,
                          city: result.city,
                          uf: result.state,
                          cep: result.zipCode
                      }
                  }
              };
          } else if (section === 'contact') {
              updateDto = {
                  person: {
                      contact: {
                          email: result.email,
                          telephone: result.phone,
                          mobilePhone: result.mobilePhone,
                          hasWhatsApp: result.hasWhatsApp
                      }
                  }
              };
          }

          this.employeeService.updateEmployee(this.employee().id, updateDto).subscribe({
              next: (updatedEmployee) => {
                  this.employee.set(updatedEmployee); // Atualiza localmente com o retorno do backend
                  alert('Dados atualizados com sucesso!');
              },
              error: (err) => {
                  console.error('Erro ao atualizar funcionário', err);
                  alert('Erro ao atualizar dados.');
              }
          });
        }
      });
    }
  }

  // Getters para facilitar o acesso no template

  get fullAddress(): string {
    const addr = this.employee().person.address;
    if (!addr) return 'Endereço não informado';
    let address = `${addr.street}, ${addr.streetNumber}`;
    if (addr.complement) address += ` - ${addr.complement}`;
    address += ` - ${addr.neighborhood}`;
    address += ` - ${addr.city}/${addr.uf}`;
    address += ` - CEP: ${addr.cep}`;
    return address;
  }

  get contact(): any {
    return this.employee().person.contact || {};
  }

  get documents(): any[] {
    return this.employee().person.documents || [];
  }

  getDocumentName(typeId: number): string {
    return DocumentTypeMap[typeId]?.descricao || 'Documento';
  }

  getPositionName(positionId: number): string {
    return PositionTypeMap[positionId].name;
  }
}
