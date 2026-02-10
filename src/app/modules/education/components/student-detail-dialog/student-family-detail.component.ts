import { Component, Input, WritableSignal, inject } from '@angular/core';
import {
  ChevronDown,
  FileText,
  LucideIconData,
  Phone,
  Home,
  Clipboard,
  UserCircle,
  Users,
  Calendar,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DetailFieldComponent } from './detail-field.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Student, StudentDwellingCondition } from '../../types/student.type';
import { Guardian } from '../../types/guardian.type';
import { DwellingVisit, FamilyMember, StudentFamily } from '../../types/student-family.type';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '../../../../shared/components/accordion/accordion-item.component';
import { SectionHeaderComponent } from './section-header.component';
import { Dialog } from '@angular/cdk/dialog';
import {
  DynamicFormDialogComponent,
  DynamicFormDialogData,
} from '../../../../shared/dynamic-form-dialog/dynamic-form-dialog.component';
import { DataTableComponent } from '../../../../shared/components/datatable/datatable.component';
import { DataTableColumn } from '../../../../shared/components/datatable/datatable-column.interface';
import { DataTableCommandsComponent } from '../../../../shared/components/datatable/datatable-commands.component';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { StudentService } from '../../services/student.service';
import { GuardianService } from '../../services/guardian.service';
import { FormField } from '../../../../shared/types/form-field.type';
import { PersonConverter } from '../../utils/person.converter';
import { StudentGuardianService } from '../../services/student-guardian.service';
import { FamilyMemberService } from '../../services/family-member.service';
import { forkJoin, of } from 'rxjs';
import { PersonDocumentService } from '../../services/person-document.service';
import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

@Component({
  selector: 'app-student-family-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    LucideAngularModule,
    DetailFieldComponent,
    AccordionComponent,
    AccordionBodyComponent,
    AccordionHeaderComponent,
    SectionHeaderComponent,
    DataTableComponent,
    DataTableCommandsComponent,
    ButtonDirective,
  ],
  templateUrl: './student-family-detail.component.html',
})
export class StudentFamilyDetailComponent {
  @Input({ required: true }) student!: WritableSignal<Student>;
  private dialog = inject(Dialog);
  private studentService = inject(StudentService);
  private guardianService = inject(GuardianService);
  private studentGuardianService = inject(StudentGuardianService);
  private familyMemberService = inject(FamilyMemberService);
  private personDocumentService = inject(PersonDocumentService);

  public openGuardianIndex: number | null = null;
  public openVisitIndex: number | null = null;

  icons: Record<string, LucideIconData> = {
    users: Users,
    chevronDown: ChevronDown,
    userCircle: UserCircle,
    phone: Phone,
    fileText: FileText,
    calendar: Calendar,
    home: Home,
    clipboard: Clipboard,
  };

  familyMemberColumns: DataTableColumn[] = [
    { field: 'name', header: 'Nome' },
    { field: 'relationship', header: 'Relação' },
    { field: 'profession', header: 'Profissão' },
    { field: 'income', header: 'Renda' },
  ];

  editData(section: string): void {
    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      family: {
        title: 'Editar Dados da Família',
        initialData: this.family,
        formConfig: [
          {
            name: 'typeDwellingId',
            label: 'Tipo de Domicílio',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Alugada' },
              { value: 2, viewValue: 'Própria' },
              { value: 3, viewValue: 'Cedida' },
            ],
          },
          { name: 'crasName', label: 'CRAS', type: 'text' },
          { name: 'informationExpirationDate', label: 'Vencimento', type: 'date' },
        ],
      },
      dwelling: {
        title: 'Editar Situação Domiciliar',
        initialData: this.dwelling,
        formConfig: [
          {
            name: 'parentsMaritalStatusId',
            label: 'Estado Civil dos Pais',
            type: 'select',
            options: [
              { value: 1, viewValue: 'Casados' },
              { value: 2, viewValue: 'Separados' },
              { value: 3, viewValue: 'Divorciados' },
              { value: 4, viewValue: 'Viúvo(a)' },
            ],
          },
          {
            name: 'staysHomeAlone',
            label: 'Permanece Sozinho em Casa',
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

      dialogRef.closed.subscribe((result) => {
        if (result) {
          let updatedStudent = this.student();
          if (section === 'family') {
            if (!updatedStudent.dwellingCondition) return;
            updatedStudent = {
              ...updatedStudent,
              dwellingCondition: {
                ...updatedStudent.dwellingCondition,
                family: { ...updatedStudent.dwellingCondition.family, ...result },
              },
            };
          } else if (section === 'dwelling') {
            if (!updatedStudent.dwellingCondition) return;
            updatedStudent = {
              ...updatedStudent,
              dwellingCondition: { ...updatedStudent.dwellingCondition, ...result },
            };
          }

          this.studentService.updateStudent(updatedStudent).subscribe({
              next: () => {
                  alert('Dados atualizados com sucesso!');
                  this.student.set(updatedStudent);
              },
              error: (err) => {
                  console.error('Erro ao atualizar', err);
                  alert('Erro ao atualizar dados.');
              }
          });
        }
      });
    }
  }

  addGuardian(): void {
    const formConfig: FormField[] = [
      { name: 'name', label: 'Nome Completo', type: 'text', required: true },
      { name: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
      { name: 'phone', label: 'Telefone', type: 'text', required: true },
      { name: 'email', label: 'E-mail', type: 'text', required: false },
      { name: 'cpf', label: 'CPF', type: 'text' },
      {
        name: 'kinshipDegreeId',
        label: 'Grau de Parentesco',
        type: 'select',
        required: true,
        options: [
          { value: 1, viewValue: 'Mãe' },
          { value: 2, viewValue: 'Pai' },
          { value: 3, viewValue: 'Irmão/Irmã' },
          { value: 4, viewValue: 'Avô/Avó' },
          { value: 5, viewValue: 'Tio/Tia' },
          { value: 6, viewValue: 'Outro' },
        ],
      },
    ];

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Responsável', formConfig, initialData: {} },
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            this.guardianService.createGuardian(result).subscribe({
                next: (createdGuardian) => {
                    const personModel = PersonConverter.toModel(createdGuardian.person as unknown as IndividualPersonDTO);
                    personModel.id = createdGuardian.id;

                    const newRelationship = {
                        studentId: this.student().id,
                        guardianId: createdGuardian.id,
                        kinshipId: result.kinshipDegreeId,
                        guardian: {
                            id: createdGuardian.id,
                            kinshipDegreeId: result.kinshipDegreeId,
                            peopleData: personModel
                        }
                    };

                    const updatedStudent = {
                        ...this.student(),
                        guardianRelashionship: [...this.student().guardianRelashionship, newRelationship]
                    };

                    this.studentGuardianService.addGuardian(this.student().id, createdGuardian.id, result.kinshipDegreeId).subscribe({
                        next: () => {
                            alert('Responsável adicionado com sucesso!');
                            this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                        },
                        error: (err) => {
                            console.error('Erro ao vincular responsável', err);
                            alert('Erro ao vincular responsável.');
                        }
                    });
                },
                error: (err) => {
                    console.error('Erro ao criar responsável', err);
                    alert('Erro ao criar responsável.');
                }
            });
        }
    });
  }

  editGuardian(guardian: Guardian): void {
    const formConfig: FormField[] = [
        { name: 'name', label: 'Nome', type: 'text', required: true },
        { name: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
        { name: 'phone', label: 'Telefone', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'cpf', label: 'CPF', type: 'text' },
        {
            name: 'kinshipDegreeId',
            label: 'Grau de Parentesco',
            type: 'select',
            required: true,
            options: [
              { value: 1, viewValue: 'Mãe' },
              { value: 2, viewValue: 'Pai' },
              { value: 3, viewValue: 'Irmão/Irmã' },
              { value: 4, viewValue: 'Avô/Avó' },
              { value: 5, viewValue: 'Tio/Tia' },
              { value: 6, viewValue: 'Outro' },
            ],
        }
    ];

    const initialData = {
        name: guardian.peopleData.personName,
        birthDate: guardian.peopleData.birthDate,
        phone: this.getGuardianPhone(guardian),
        email: guardian.peopleData.contact?.email,
        cpf: this.getGuardianCpf(guardian),
        kinshipDegreeId: guardian.kinshipDegreeId
    };

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: { title: 'Editar Responsável', formConfig, initialData }
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            const observables = [];

            // 1. Atualizar dados do guardião (Pessoa)
            observables.push(this.guardianService.updateGuardian(guardian.id, result));

            // 2. Atualizar vínculo (Parentesco)
            if (result.kinshipDegreeId !== guardian.kinshipDegreeId) {
                observables.push(this.studentGuardianService.updateGuardian(this.student().id, guardian.id, result.kinshipDegreeId));
            }

            // 3. Atualizar Documento (CPF)
            const existingCpfDoc = guardian.peopleData.documents.find(d => d.documentTypeId === 1);
            const newCpf = result.cpf;
            const personId = guardian.peopleData.id;

            if (newCpf && !existingCpfDoc) {
                // Criar
                observables.push(this.personDocumentService.createDocument(personId, {
                    documentTypeId: 1,
                    number: newCpf
                }));
            } else if (newCpf && existingCpfDoc && newCpf !== existingCpfDoc.number) {
                // Atualizar
                observables.push(this.personDocumentService.updateDocument(personId, existingCpfDoc.id, {
                    documentTypeId: 1,
                    number: newCpf
                }));
            } else if (!newCpf && existingCpfDoc) {
                // Remover
                observables.push(this.personDocumentService.deleteDocument(personId, existingCpfDoc.id));
            }

            forkJoin(observables).subscribe({
                next: () => {
                    alert('Responsável atualizado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao atualizar responsável', err);
                    alert('Erro ao atualizar responsável.');
                }
            });
        }
    });
  }

  removeGuardian(guardianId: number): void {
    if (confirm('Tem certeza que deseja remover este responsável?')) {
        this.studentGuardianService.removeGuardian(this.student().id, guardianId).subscribe({
            next: () => {
                alert('Responsável removido com sucesso!');
                this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
            },
            error: (err) => {
                console.error('Erro ao remover responsável', err);
                alert('Erro ao remover responsável.');
            }
        });
    }
  }

  addFamilyMember(): void {
      const formConfig: FormField[] = [
          { name: 'name', label: 'Nome Completo', type: 'text', required: true },
          {
              name: 'kinshipDegreeId',
              label: 'Grau de Parentesco',
              type: 'select',
              required: true,
              options: [
                  { value: 1, viewValue: 'Mãe' },
                  { value: 2, viewValue: 'Pai' },
                  { value: 3, viewValue: 'Irmão/Irmã' },
                  { value: 4, viewValue: 'Avô/Avó' },
                  { value: 5, viewValue: 'Tio/Tia' },
                  { value: 6, viewValue: 'Outro' },
              ],
          },
          { name: 'profession', label: 'Profissão', type: 'text' },
          { name: 'income', label: 'Renda (R$)', type: 'text' },
      ];

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: { title: 'Adicionar Membro da Família', formConfig }
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            const familyId = this.family?.id;
            if (!familyId) {
                alert('Família não encontrada para adicionar membro.');
                return;
            }

            this.familyMemberService.addMember(familyId, result).subscribe({
                next: () => {
                    alert('Membro adicionado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao adicionar membro', err);
                    alert('Erro ao adicionar membro.');
                }
            });
        }
    });
  }

  onEditFamilyMember(familyMember: FamilyMember) {
      const formConfig: FormField[] = [
          { name: 'name', label: 'Nome Completo', type: 'text', required: true },
          {
              name: 'kinshipDegreeId',
              label: 'Grau de Parentesco',
              type: 'select',
              required: true,
              options: [
                  { value: 1, viewValue: 'Mãe' },
                  { value: 2, viewValue: 'Pai' },
                  { value: 3, viewValue: 'Irmão/Irmã' },
                  { value: 4, viewValue: 'Avô/Avó' },
                  { value: 5, viewValue: 'Tio/Tia' },
                  { value: 6, viewValue: 'Outro' },
              ],
          },
          { name: 'profession', label: 'Profissão', type: 'text' },
          { name: 'income', label: 'Renda (R$)', type: 'text' },
      ];

    const initialData = { ...familyMember };

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: { title: 'Editar Membro da Família', formConfig, initialData }
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            const familyId = this.family?.id;
            if (!familyId) return;

            this.familyMemberService.updateMember(familyId, Number(familyMember.id), result).subscribe({
                next: () => {
                    alert('Membro atualizado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao atualizar membro', err);
                    alert('Erro ao atualizar membro.');
                }
            });
        }
    });
  }

  onDeleteFamilyMember(familyMember: FamilyMember) {
    if (confirm('Tem certeza que deseja remover este membro?')) {
        const familyId = this.family?.id;
        if (!familyId) return;

        this.familyMemberService.removeMember(familyId, Number(familyMember.id)).subscribe({
            next: () => {
                alert('Membro removido com sucesso!');
                this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
            },
            error: (err) => {
                console.error('Erro ao remover membro', err);
                alert('Erro ao remover membro.');
            }
        });
    }
  }

  // Helpers para imutabilidade (não mais usados para atualização direta, mas úteis se quisermos otimizar UI)
  // ... (mantive os helpers mas não os uso mais na lógica principal)

  get guardians(): Guardian[] {
    return this.student().guardianRelashionship.map((rel) => rel.guardian);
  }

  get dwelling(): StudentDwellingCondition | null {
    return this.student().dwellingCondition;
  }

  get family(): StudentFamily | undefined {
    return this.dwelling?.family;
  }

  get visits(): DwellingVisit[] {
    return this.family?.dwellingVisits || [];
  }

  get dwellingType(): string {
    if (!this.family) return 'Não informado';
    switch (this.family.typeDwellingId) {
      case 1:
        return 'Alugada';
      case 2:
        return 'Própria';
      case 3:
        return 'Cedida';
      default:
        return 'Não informado';
    }
  }

  get parentsMaritalStatus(): string {
    if (!this.dwelling) return 'Não informado';
    switch (this.dwelling.parentsMaritalStatusId) {
      case 1:
        return 'Casados';
      case 2:
        return 'Separados';
      case 3:
        return 'Divorciados';
      case 4:
        return 'Viúvo(a)';
      default:
        return 'Não informado';
    }
  }

  getGuardianPhone(guardian: Guardian): string {
    return (
      guardian.peopleData.contact?.mobilePhone ||
      guardian.peopleData.contact?.telephone ||
      'Não informado'
    );
  }

  getGuardianCpf(guardian: Guardian): string | undefined {
    return guardian.peopleData.documents.find((doc) => doc.documentTypeId === 1)?.number;
  }

  getKinshipName(kinshipId: number): string {
    // Assumindo IDs: 1-Mãe, 2-Pai, 3-Irmão/Irmã, 4-Avó/Avô, 5-Tio/Tia
    switch (kinshipId) {
      case 1:
        return 'Mãe';
      case 2:
        return 'Pai';
      case 3:
        return 'Irmão/Irmã';
      case 4:
        return 'Avó/Avô';
      default:
        return 'Não informado';
    }
  }

  toggleGuardian(index: number): void {
    this.openGuardianIndex = this.openGuardianIndex === index ? null : index;
  }

  toggleVisit(index: number): void {
    this.openVisitIndex = this.openVisitIndex === index ? null : index;
  }
}
