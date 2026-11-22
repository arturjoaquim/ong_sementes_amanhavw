import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Briefcase, User, MapPin, Phone, FileText, Mail, AlertCircle } from 'lucide-angular';
import { Dialog } from '@angular/cdk/dialog';
import { EmployeeResponseDTO } from '../../types/dtos/employee-response.dto';
import { EmployeeService } from '../../services/employee.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { SectionHeaderComponent } from '../../components/student-detail-dialog/section-header.component';
import { DynamicFormDialogComponent, DynamicFormDialogData } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { UpdateEmployeeDTO } from '../../types/dtos/update-employee.dto';
import { DocumentTypeMap, PositionTypeMap } from '../../../../shared/utils/lookup.enums';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    PageLayoutComponent,
    CardComponent,
    ButtonDirective,
    SectionHeaderComponent,
  ],
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private employeeService = inject(EmployeeService);

  employee = signal<EmployeeResponseDTO | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  icons = {
    arrowLeft: ArrowLeft,
    briefcase: Briefcase,
    user: User,
    mapPin: MapPin,
    phone: Phone,
    fileText: FileText,
    mail: Mail,
    alertCircle: AlertCircle,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(Number(id));
    } else {
      this.errorMessage.set('Identificador do funcionário não informado.');
      this.loading.set(false);
    }
  }

  loadEmployee(id: number): void {
    this.loading.set(true);
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do funcionário', err);
        this.errorMessage.set('Não foi possível carregar os dados do funcionário.');
        this.loading.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  editData(section: string): void {
    const emp = this.employee();
    if (!emp) return;

    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      personal: {
        title: 'Editar Dados Pessoais',
        initialData: {
          ...emp.person,
          name: emp.person.personName,
          positionId: emp.positionId,
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
          ...emp.person.address,
          number: emp.person.address?.streetNumber,
          state: emp.person.address?.uf,
          zipCode: emp.person.address?.cep,
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
          ...emp.person.contact,
          phone: emp.person.contact?.telephone,
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
                fatherName: result.fatherName,
              },
              positionId: result.positionId,
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
                  cep: result.zipCode,
                },
              },
            };
          } else if (section === 'contact') {
            updateDto = {
              person: {
                contact: {
                  email: result.email,
                  telephone: result.phone,
                  mobilePhone: result.mobilePhone,
                  hasWhatsApp: result.hasWhatsApp,
                },
              },
            };
          }

          this.employeeService.updateEmployee(emp.id, updateDto).subscribe({
            next: (updatedEmployee) => {
              this.employee.set(updatedEmployee);
              alert('Dados atualizados com sucesso!');
            },
            error: (err) => {
              console.error('Erro ao atualizar funcionário', err);
              alert('Erro ao atualizar dados.');
            },
          });
        }
      });
    }
  }

  get fullAddress(): string {
    const addr = this.employee()?.person?.address;
    if (!addr) return 'Endereço não informado';
    let address = `${addr.street}, ${addr.streetNumber}`;
    if (addr.complement) address += ` - ${addr.complement}`;
    address += ` - ${addr.neighborhood}`;
    address += ` - ${addr.city}/${addr.uf}`;
    address += ` - CEP: ${addr.cep}`;
    return address;
  }

  get contact(): any {
    return this.employee()?.person?.contact || {};
  }

  get documents(): any[] {
    return this.employee()?.person?.documents || [];
  }

  getDocumentName(typeId: number): string {
    return DocumentTypeMap[typeId]?.descricao || 'Documento';
  }

  getPositionName(positionId: number | undefined): string {
    if (!positionId) return 'Não informado';
    return PositionTypeMap[positionId]?.name || 'Não informado';
  }
}
