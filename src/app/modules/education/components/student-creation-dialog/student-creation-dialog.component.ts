import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Student } from '../../types/student.type';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { Tab } from '../../../../shared/types/tab.type';
import { TabsComponent } from '../../../../shared/components/tab/tabs.component';
import { FormField } from '../../../../shared/types/form-field.type';
import { DynamicFormDialogComponent } from '../../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import {
  DocumentTypeMap,
  DwellingType,
  EducationStatus,
  EnrollmentOrigin,
  MaritalStatus,
  Period,
  RaceType,
  SchoolGrade,
  MedicalLocation,
} from '../../../../shared/utils/lookup.enums';
import { StudentService } from '../../services/student.service';
import { GuardianService } from '../../services/guardian.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-student-form-dialog',
  templateUrl: './student-creation-dialog.component.html',
  standalone: true,
  imports: [
    TabsComponent,
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
})
export class StudentCreationDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<Student>>(DialogRef<Student>);
  private dialog = inject(Dialog);
  private cdr = inject(ChangeDetectorRef);
  private studentService = inject(StudentService);
  private guardianService = inject(GuardianService);

  raceTypeOptions!: RaceType[];
  studyLevelOptions!: SchoolGrade[];
  maritalStatusOptions!: MaritalStatus[];
  periodOptions!: Period[];
  educationStatusOptions!: EducationStatus[];
  enrollmentOriginOptions!: EnrollmentOrigin[];
  dwellingTypeOptions!: DwellingType[];

  tabs: Tab[] = [
    { id: 'personal', label: 'Dados Pessoais' },
    { id: 'subscribe', label: 'Dados da Inscrição' },
    { id: 'family', label: 'Família e Moradia' },
    { id: 'academic', label: 'Dados Acadêmicos' },
    { id: 'health', label: 'Dados de Saúde' },
  ];
  activeTab = 'personal';

  studentForm = new FormGroup({
    personData: new FormGroup({
      name: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      sexId: new FormControl<number | null>(null),
      fatherName: new FormControl(''),
      motherName: new FormControl(''),
      raceId: new FormControl<number | null>(null),
      naturalnessId: new FormControl<number | null>(null),
      address: new FormGroup({
        street: new FormControl(''),
        number: new FormControl(''),
        complement: new FormControl(''),
        neighborhood: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zipCode: new FormControl(''),
      }),
      documents: new FormArray([
        new FormGroup({
          documentTypeId: new FormControl(1),
          documentNumber: new FormControl(''),
        }),
        new FormGroup({
          documentTypeId: new FormControl(2),
          documentNumber: new FormControl(''),
        }),
      ]),
      education: new FormGroup({
        institutionName: new FormControl(''),
        studyLevelId: new FormControl<number | null>(null),
        academicPeriodId: new FormControl<number | null>(null),
        educationStatusId: new FormControl<number | null>(null),
      }),
    }),
    enrollmentData: new FormGroup({
      enrollmentDate: new FormControl('', [Validators.required]),
      periodId: new FormControl<number | null>(null),
      enrollmentOrigin: new FormControl(''),
      accompaniedStatus: new FormControl(true),
      transportGuardianName: new FormControl(''),
    }),
    healthData: new FormGroup({
      ubsName: new FormControl(''),
      flagUseGlasses: new FormControl(false),
      medicalNotes: new FormArray<FormGroup>([]),
      medicalTreatments: new FormArray<FormGroup>([]),
    }),
    dwellingCondition: new FormGroup({
      parentsMaritalStatusId: new FormControl<number | null>(null),
      staysHomeAlone: new FormControl(false),
      hasSeparatedParentContact: new FormControl(false),
      description: new FormControl(''),
      family: new FormGroup({
        typeDwellingId: new FormControl<number | null>(null),
        crasName: new FormControl(''),
        familyMembers: new FormArray<FormGroup>([]),
      }),
    }),
    guardians: new FormArray<FormGroup>([]),
  });

  ngOnInit(): void {
    this.raceTypeOptions = Object.values(RaceType).map((raceType) => ({
      id: raceType.id,
      descricao: raceType.descricao,
    }));

    this.studyLevelOptions = Object.values(SchoolGrade).map((schoolGrade) => ({
      id: schoolGrade.id,
      descricao: schoolGrade.descricao,
    }));

    this.periodOptions = Object.values(Period).map((period) => ({
      id: period.id,
      descricao: period.descricao,
    })) as Period[];

    this.educationStatusOptions = Object.values(EducationStatus).map((educationStatus) => ({
      id: educationStatus.id,
      descricao: educationStatus.descricao,
    })) as EducationStatus[];

    this.maritalStatusOptions = Object.values(MaritalStatus).map((parentsMaritalStatus) => ({
      id: parentsMaritalStatus.id,
      descricao: parentsMaritalStatus.descricao,
    })) as MaritalStatus[];

    this.enrollmentOriginOptions = Object.values(EnrollmentOrigin).map((enrollmentOrigin) => ({
      id: enrollmentOrigin.id,
      descricao: enrollmentOrigin.descricao,
    })) as EnrollmentOrigin[];

    this.dwellingTypeOptions = Object.values(DwellingType).map((dwellingType) => ({
      id: dwellingType.id,
      descricao: dwellingType.descricao,
    })) as DwellingType[];
  }

  onTabChange(tabId: string) {
    this.activeTab = tabId;
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();

      // 1. Criar Guardiões primeiro usando GuardianService
      const guardianObservables = formValue.guardians.map((guardianForm: any) => {
        return this.guardianService.createGuardian(guardianForm).pipe(
            map(createdGuardian => ({
                guardianId: createdGuardian.id,
                kinshipId: guardianForm.kinshipDegreeId
            }))
        );
      });

      const guardians$ = guardianObservables.length > 0 ? forkJoin(guardianObservables) : of([]);

      guardians$.pipe(
        switchMap((createdGuardians: any[]) => {
            // 2. Montar DTO do Estudante
            const createDto: any = {
                person: {
                    personName: formValue.personData.name,
                    birthDate: formValue.personData.birthDate,
                    sexId: formValue.personData.sexId,
                    fatherName: formValue.personData.fatherName,
                    motherName: formValue.personData.motherName,
                    raceId: formValue.personData.raceId,
                    naturalnessId: formValue.personData.naturalnessId,
                    address: {
                        street: formValue.personData.address.street,
                        streetNumber: formValue.personData.address.number,
                        complement: formValue.personData.address.complement,
                        neighborhood: formValue.personData.address.neighborhood,
                        city: formValue.personData.address.city,
                        uf: formValue.personData.address.state,
                        cep: formValue.personData.address.zipCode
                    },
                    contact: {
                        telephone: '',
                        mobilePhone: '',
                        hasWhatsApp: false,
                        email: ''
                    },
                    documents: formValue.personData.documents.map((doc: any) => ({
                        documentTypeId: doc.documentTypeId,
                        number: doc.documentNumber
                    })),
                    education: {
                        institution: formValue.personData.education.institutionName,
                        periodId: formValue.personData.education.academicPeriodId,
                        educationLevelId: formValue.personData.education.studyLevelId,
                        educationStatusId: formValue.personData.education.educationStatusId
                    }
                },
                studentData: {
                    registrationOriginId: formValue.enrollmentData.enrollmentOrigin,
                    periodId: formValue.enrollmentData.periodId,
                    hasTransportAutonomy: formValue.enrollmentData.accompaniedStatus,
                    transportResponsibleName: formValue.enrollmentData.transportGuardianName
                },
                guardians: createdGuardians,
                registrationDate: formValue.enrollmentData.enrollmentDate,

                // Mapeamento de HealthData
                healthData: {
                    ubsReference: formValue.healthData.ubsName,
                    wearsGlasses: formValue.healthData.flagUseGlasses,
                    infoExpirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default: 1 ano

                    // medicalNotes -> medications (StudentMedication)
                    medications: formValue.healthData.medicalNotes.map((n: any) => ({
                        medicationName: n.medicationName,
                        frequency: n.frequency,
                        dosage: n.dosage
                    })),

                    // medicalTreatments -> treatments (MedicalTreatment)
                    treatments: formValue.healthData.medicalTreatments.map((t: any) => ({
                        treatmentDescription: t.description,
                        observations: t.observations,
                        monitoringLocationId: t.monitoringLocationId
                    }))
                },

                // Mapeamento de DwellingCondition
                dwellingCondition: {
                    parentsMaritalStatusId: formValue.dwellingCondition.parentsMaritalStatusId,
                    keepsContactWithSpouse: formValue.dwellingCondition.hasSeparatedParentContact,
                    staysAloneAtHome: formValue.dwellingCondition.staysHomeAlone,
                    description: formValue.dwellingCondition.description,
                    family: {
                        domicileTypeId: formValue.dwellingCondition.family.typeDwellingId,
                        referenceCras: formValue.dwellingCondition.family.crasName,
                        members: formValue.dwellingCondition.family.familyMembers.map((m: any) => ({
                            name: m.name,
                            profession: m.profession,
                            monthlyIncome: m.income,
                            kinshipId: m.kinshipDegreeId
                        }))
                    }
                }
            };

            return this.studentService.createStudent(createDto);
        })
      ).subscribe({
        next: () => {
            alert('Estudante criado com sucesso!');
            this.dialogRef.close();
        },
        error: (err) => {
            console.error('Erro ao criar estudante', err);
            alert('Erro ao criar estudante. Verifique os dados e tente novamente.');
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

    const dialogRef = this.dialog.open<any>(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Responsável', formConfig, initialData: {} },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.guardians.push(
            new FormGroup({
              name: new FormControl(result.name, Validators.required),
              birthDate: new FormControl(result.birthDate, Validators.required),
              phone: new FormControl(result.phone, Validators.required),
              email: new FormControl(result.email),
              cpf: new FormControl(result.cpf),
              kinshipDegreeId: new FormControl(result.kinshipDegreeId, Validators.required),
            }),
          );
          this.cdr.detectChanges();
        });
      }
    });
  }

  addMedicalNote(): void {
    const formConfig: FormField[] = [
      { name: 'medicationName', label: 'Nome do Medicamento', type: 'text', required: true },
      { name: 'frequency', label: 'Frequência', type: 'text', required: true },
      { name: 'dosage', label: 'Dosagem', type: 'text', required: true },
    ];

    const dialogRef = this.dialog.open<any>(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Medicamento', formConfig },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.medicalNotes.push(
            new FormGroup({
              medicationName: new FormControl(result.medicationName, Validators.required),
              frequency: new FormControl(result.frequency, Validators.required),
              dosage: new FormControl(result.dosage, Validators.required),
            }),
          );
          this.cdr.detectChanges();
        });
      }
    });
  }

  addMedicalTreatment(): void {
    const medicalLocationOptions = Object.values(MedicalLocation).map((loc) => ({
        value: loc.id,
        viewValue: loc.descricao,
    }));

    const formConfig: FormField[] = [
      {
        name: 'description',
        label: 'Descrição do Tratamento',
        type: 'text',
        required: true,
      },
      {
        name: 'observations',
        label: 'Observações',
        type: 'text',
      },
      {
        name: 'monitoringLocationId',
        label: 'Local de Acompanhamento',
        type: 'select',
        options: medicalLocationOptions,
      },
    ];

    const dialogRef = this.dialog.open<any>(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Tratamento Médico', formConfig },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.medicalTreatments.push(
            new FormGroup({
              description: new FormControl(result.description, Validators.required),
              observations: new FormControl(result.observations),
              monitoringLocationId: new FormControl(result.monitoringLocationId),
            }),
          );
          this.cdr.detectChanges();
        });
      }
    });
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

    const dialogRef = this.dialog.open<any>(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Membro da Família', formConfig },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.familyMembers.push(
            new FormGroup({
              name: new FormControl(result.name, Validators.required),
              kinshipDegreeId: new FormControl(result.kinshipDegreeId, Validators.required),
              profession: new FormControl(result.profession),
              income: new FormControl(result.income),
            }),
          );
          this.cdr.detectChanges();
        });
      }
    });
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

  removeFamilyMember(index: number): void {
    this.familyMembers.removeAt(index);
  }

  removeMedicalNote(index: number): void {
    this.medicalNotes.removeAt(index);
  }

  removeMedicalTreatment(index: number): void {
    this.medicalTreatments.removeAt(index);
  }

  removeGuardian(index: number): void {
    this.guardians.removeAt(index);
  }

  get guardians(): FormArray {
    return this.studentForm.get('guardians') as FormArray;
  }

  get medicalNotes(): FormArray {
    return this.studentForm.get('healthData.medicalNotes') as FormArray;
  }

  get medicalTreatments(): FormArray {
    return this.studentForm.get('healthData.medicalTreatments') as FormArray;
  }

  get familyMembers(): FormArray {
    return this.studentForm.get('dwellingCondition.family.familyMembers') as FormArray;
  }

  cancel() {
    this.dialogRef.close();
  }

  getDocumentTypeName(id: number) {
    return DocumentTypeMap[id]?.descricao || 'Não informado';
  }
}
