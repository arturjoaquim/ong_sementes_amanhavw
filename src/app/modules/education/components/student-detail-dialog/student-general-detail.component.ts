import { Component, Input, WritableSignal, inject } from '@angular/core';
import {
  Calendar,
  FileText,
  GraduationCap,
  LucideIconData,
  MapPin,
  UserCircle,
  Users,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DetailFieldComponent } from './detail-field.component';
import { Student } from '../../types/student.type';
import { SectionHeaderComponent } from './section-header.component';
import { Dialog } from '@angular/cdk/dialog';
import {
  DynamicFormDialogComponent,
  DynamicFormDialogData,
} from '../../../../shared/dynamic-form-dialog/dynamic-form-dialog.component';
import { EnrollmentOriginMap } from '../../../../shared/utils/lookup.enums';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-general-detail',
  standalone: true,
  imports: [CommonModule, CardComponent, DetailFieldComponent, SectionHeaderComponent],
  templateUrl: './student-general-detail.component.html',
})
export class StudentGeneralDetailComponent {
  @Input({ required: true }) student!: WritableSignal<Student>;
  private dialog = inject(Dialog);
  private studentService = inject(StudentService);

  icons: Record<string, LucideIconData> = {
    graduationCap: GraduationCap,
    mapPin: MapPin,
    calendar: Calendar,
    users: Users,
    userCircle: UserCircle,
    fileText: FileText,
  };

  editData(section: string): void {
    const enrollmentOriginOptions = Object.values(EnrollmentOriginMap).map((origin) => ({
      value: origin.id,
      viewValue: origin.descricao,
    }));

    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      personal: {
        title: 'Editar Dados Pessoais',
        initialData: {
            ...this.student().personData,
            name: this.student().personData.personName // Mapeia personName -> name
        },
        formConfig: [
          { name: 'name', label: 'Nome Completo', type: 'text', required: true },
          { name: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
          {
            name: 'sexId',
            label: 'Gênero',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Masculino' },
              { value: 2, viewValue: 'Feminino' },
            ],
            required: true,
          },
          {
            name: 'raceId',
            label: 'Raça/Cor',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Branca' },
              { value: 2, viewValue: 'Parda' },
              { value: 3, viewValue: 'Amarela' },
              { value: 4, viewValue: 'Preta' },
              { value: 5, viewValue: 'Indígena' },
            ],
          },
          {
            name: 'naturalnessId',
            label: 'Naturalidade',
            type: 'select',
            options: [
              { value: 1, viewValue: 'São Paulo, SP' },
              { value: 2, viewValue: 'Salvador, BA' },
              { value: 3, viewValue: 'Curitiba, PR' },
            ],
          },
          { name: 'motherName', label: 'Nome da Mãe', type: 'text' },
          { name: 'fatherName', label: 'Nome do Pai', type: 'text' },
        ],
      },
      enrollment: {
        title: 'Editar Dados da Matrícula',
        initialData: {
            ...this.student(),
            enrollmentOrigin: Number(this.student().enrollmentOrigin) // Converte para número para o select
        },
        formConfig: [
          {
            name: 'periodId',
            label: 'Período',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Manhã' },
              { value: 2, viewValue: 'Tarde' },
            ],
            required: true,
          },
          {
            name: 'enrollmentOrigin',
            label: 'Origem da Inscrição',
            type: 'select',
            options: enrollmentOriginOptions,
            required: true
          },
          { name: 'enrollmentDate', label: 'Data da Inscrição', type: 'date', required: true },
          {
            name: 'accompaniedStatus',
            label: 'Vem Acompanhado?',
            type: 'select',
            options: [
              { value: true, viewValue: 'Sim' },
              { value: false, viewValue: 'Não' },
            ],
          },
          { name: 'transportGuardianName', label: 'Nome do Acompanhante', type: 'text' },
        ],
      },
      address: {
        title: 'Editar Endereço',
        initialData: {
            ...this.student().personData.address,
            number: this.student().personData.address?.streetNumber, // Mapeia streetNumber -> number
            state: this.student().personData.address?.uf, // Mapeia uf -> state
            zipCode: this.student().personData.address?.cep // Mapeia cep -> zipCode
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
      documents: {
        title: 'Editar Documentos Civis',
        initialData: {
          cpf: this.cpf,
          rg: this.rg,
          nis: this.nisNumber === 'Não informado' ? '' : this.nisNumber,
          birthCertificateNumber: this.birthCertificate?.number,
          birthCertificateBook: this.birthCertificate?.book,
          birthCertificatePage: this.birthCertificate?.page,
        },
        formConfig: [
          { name: 'cpf', label: 'CPF', type: 'text' },
          { name: 'rg', label: 'RG', type: 'text' },
          { name: 'nis', label: 'NIS', type: 'text' },
          { name: 'birthCertificateNumber', label: 'Nº da Certidão de Nasc.', type: 'text' },
          { name: 'birthCertificateBook', label: 'Livro (Certidão)', type: 'text' },
          { name: 'birthCertificatePage', label: 'Folha (Certidão)', type: 'text' },
        ],
      },
    };

    if (editFormDataCatalog[section]) {
      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: editFormDataCatalog[section],
      });

      dialogRef.closed.subscribe((result) => {
        if (result) {
          console.log(`Dados salvos para a seção ${section}:`, result);
          this.student.update((currentStudent) => {
            let updatedStudent = currentStudent;
            switch (section) {
              case 'personal':
                const { name, ...restPersonal } = result as any;
                updatedStudent = {
                  ...currentStudent,
                  personData: {
                      ...currentStudent.personData,
                      personName: name, // Mapeia de volta name -> personName
                      ...restPersonal
                  },
                };
                break;
              case 'enrollment':
                updatedStudent = { ...currentStudent, ...result };
                break;
              case 'address':
                const { number, state, zipCode, ...restAddress } = result as any;
                updatedStudent = {
                  ...currentStudent,
                  personData: {
                    ...currentStudent.personData,
                    address: {
                        id: currentStudent.personData.address?.id || 0,
                        street: '',
                        streetNumber: number, // Mapeia de volta number -> streetNumber
                        complement: '',
                        neighborhood: '',
                        city: '',
                        uf: state, // Mapeia de volta state -> uf
                        cep: zipCode, // Mapeia de volta zipCode -> cep
                        ...currentStudent.personData.address,
                        ...restAddress
                    },
                  },
                };
                break;
              case 'documents':
                console.warn(
                  'A atualização de documentos via formulário dinâmico não está totalmente implementada.',
                );
                return currentStudent;

              default:
                return currentStudent;
            }

            // Chama o serviço para persistir a atualização
            this.studentService.updateStudent(updatedStudent).subscribe({
                next: () => {
                    console.log('Estudante atualizado com sucesso');
                    alert('Dados atualizados com sucesso!');
                },
                error: (err) => {
                    console.error('Erro ao atualizar estudante', err);
                    alert('Erro ao atualizar dados. Tente novamente.');
                    // Opcional: Reverter a atualização local em caso de erro
                }
            });

            return updatedStudent;
          });
        }
      });
    }
  }

  // --- Getters para Dados da Matrícula ---
  get period(): string {
    switch (this.student().periodId) {
      case 1:
        return 'Manhã';
      case 2:
        return 'Tarde';
      default:
        return 'Não informado';
    }
  }

  get enrollmentOriginDescription(): string {
    const originId = Number(this.student().enrollmentOrigin);
    if (isNaN(originId)) return this.student().enrollmentOrigin || 'Não informado';
    return EnrollmentOriginMap[originId]?.descricao || 'Não informado';
  }

  // --- Getters para Dados Pessoais ---
  get birthDate(): Date {
    return this.student().personData.birthDate;
  }

  get gender(): string {
    switch (this.student().personData.sexId) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Feminino';
      default:
        return 'Não informado';
    }
  }

  get race(): string {
    switch (this.student().personData.raceId) {
      case 1:
        return 'Branca';
      case 2:
        return 'Parda';
      case 3:
        return 'Amarela';
      case 4:
        return 'Preta';
      case 5:
        return 'Indígena';
      default:
        return 'Não informada';
    }
  }

  get naturalness(): string {
    switch (this.student().personData.naturalnessId) {
      case 1:
        return 'São Paulo, SP';
      case 2:
        return 'Salvador, BA';
      case 3:
        return 'Curitiba, PR';
      default:
        return 'Não informada';
    }
  }

  get fatherName(): string {
    return this.student().personData.fatherName || 'Não informado';
  }

  get motherName(): string {
    return this.student().personData.motherName || 'Não informado';
  }

  // --- Getters para Documentos ---
  get cpf(): string | undefined {
    return this.student().personData.documents.find((doc) => doc.documentTypeId === 1)?.number;
  }

  get rg(): string | undefined {
    return this.student().personData.documents.find((doc) => doc.documentTypeId === 2)?.number;
  }

  get birthCertificate(): { number: string; book: string; page: string } | undefined {
    const cert = this.student().personData.documents.find((doc) => doc.documentTypeId === 3);
    if (!cert) return undefined;
    return {
      number: cert.number,
      book: cert.documentDetail ? cert.documentDetail['book'] || 'N/A' : 'N/A',
      page: cert.documentDetail ? cert.documentDetail['page'] || 'N/A' : 'N/A',
    };
  }

  get nisNumber(): string {
    return (
      this.student().personData.documents.find((doc) => doc.documentTypeId === 4)?.number ||
      'Não informado'
    );
  }

  // --- Getters para Endereço ---
  get fullStreet(): string {
    const addr = this.student().personData.address;
    if (!addr) return 'Não informado';
    let addressString = `${addr.street}, ${addr.streetNumber}`;
    if (addr.complement) {
      addressString += ` - ${addr.complement}`;
    }
    return addressString;
  }

  get neighborhood(): string {
    return this.student().personData.address?.neighborhood || 'Não informado';
  }

  get city(): string {
    return this.student().personData.address?.city || 'Não informado';
  }

  get state(): string {
    return this.student().personData.address?.uf || 'Não informado';
  }

  get zipCode(): string {
    return this.student().personData.address?.cep || 'Não informado';
  }
}
