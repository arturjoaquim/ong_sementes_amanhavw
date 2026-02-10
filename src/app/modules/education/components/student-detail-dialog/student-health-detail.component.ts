import { Component, Input, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Student, StudentMedicalTreatment } from '../../types/student.type';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '../../../../shared/components/accordion/accordion-item.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { DetailFieldComponent } from './detail-field.component';
import { Calendar, Clipboard, Glasses, House } from 'lucide-angular';
import { SectionHeaderComponent } from './section-header.component';
import {
  DynamicFormDialogComponent,
  DynamicFormDialogData,
} from '../../../../shared/dynamic-form-dialog/dynamic-form-dialog.component';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { MedicalLocation, MedicalLocationMap } from '../../../../shared/utils/lookup.enums';
import { StudentService } from '../../services/student.service';
import { StudentHealthService } from '../../services/student-health.service';
import { FormField } from '../../../../shared/types/form-field.type';

@Component({
  selector: 'app-student-health-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    AccordionComponent,
    AccordionHeaderComponent,
    AccordionBodyComponent,
    DetailFieldComponent,
    SectionHeaderComponent,
    ButtonDirective,
  ],
  templateUrl: './student-health-detail.component.html',
})
export class StudentHealthDetailComponent {
  @Input({ required: true }) student!: WritableSignal<Student>;
  private dialog = inject(Dialog);
  private studentService = inject(StudentService);
  private studentHealthService = inject(StudentHealthService);

  icons = {
    house: House,
    glasses: Glasses,
    calendar: Calendar,
    clipboard: Clipboard
  };
  openMedicationIndex: number | null = null;
  openTreatmentIndex: number | null = null;

  toggleMedication(index: number) {
    this.openMedicationIndex = this.openMedicationIndex === index ? null : index;
  }

  toggleTreatment(index: number) {
    this.openTreatmentIndex = this.openTreatmentIndex === index ? null : index;
  }

  addMedication() {
    const formConfig: FormField[] = [
      { name: 'medicationName', label: 'Nome do Medicamento', type: 'text', required: true },
      { name: 'frequency', label: 'Frequência', type: 'text', required: true },
      { name: 'dosage', label: 'Dosagem', type: 'text', required: true },
    ];

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Medicamento', formConfig },
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            this.studentHealthService.addMedication(this.student().id, result).subscribe({
                next: () => {
                    alert('Medicamento adicionado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao adicionar medicamento', err);
                    alert('Erro ao adicionar medicamento.');
                }
            });
        }
    });
  }

  addTreatment() {
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

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: { title: 'Adicionar Tratamento Médico', formConfig },
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            this.studentHealthService.addTreatment(this.student().id, result).subscribe({
                next: () => {
                    alert('Tratamento adicionado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao adicionar tratamento', err);
                    alert('Erro ao adicionar tratamento.');
                }
            });
        }
    });
  }

  editMedication(medication: any) {
    const formConfig: FormField[] = [
      { name: 'medicationName', label: 'Nome do Medicamento', type: 'text', required: true },
      { name: 'frequency', label: 'Frequência', type: 'text', required: true },
      { name: 'dosage', label: 'Dosagem', type: 'text', required: true },
    ];

    const initialData = { ...medication };

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: { title: 'Editar Medicamento', formConfig, initialData },
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            this.studentHealthService.updateMedication(this.student().id, medication.id, result).subscribe({
                next: () => {
                    alert('Medicamento atualizado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao atualizar medicamento', err);
                    alert('Erro ao atualizar medicamento.');
                }
            });
        }
    });
  }

  removeMedication(medicationId: number) {
    if (confirm('Tem certeza que deseja remover este medicamento?')) {
        this.studentHealthService.removeMedication(this.student().id, medicationId).subscribe({
            next: () => {
                alert('Medicamento removido com sucesso!');
                this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
            },
            error: (err) => {
                console.error('Erro ao remover medicamento', err);
                alert('Erro ao remover medicamento.');
            }
        });
    }
  }

  editTreatment(treatment: any) {
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

    const initialData = {
        description: treatment.treatmentDescription,
        observations: treatment.observations,
        monitoringLocationId: treatment.monitoringLocationId
    };

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: { title: 'Editar Tratamento Médico', formConfig, initialData },
    });

    dialogRef.closed.subscribe((result: any) => {
        if (result) {
            this.studentHealthService.updateTreatment(this.student().id, treatment.id, result).subscribe({
                next: () => {
                    alert('Tratamento atualizado com sucesso!');
                    this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
                },
                error: (err) => {
                    console.error('Erro ao atualizar tratamento', err);
                    alert('Erro ao atualizar tratamento.');
                }
            });
        }
    });
  }

  removeTreatment(treatmentId: number) {
    if (confirm('Tem certeza que deseja remover este tratamento?')) {
        this.studentHealthService.removeTreatment(this.student().id, treatmentId).subscribe({
            next: () => {
                alert('Tratamento removido com sucesso!');
                this.studentService.getStudentDetailsById(this.student().id).subscribe(s => this.student.set(s));
            },
            error: (err) => {
                console.error('Erro ao remover tratamento', err);
                alert('Erro ao remover tratamento.');
            }
        });
    }
  }

  editData(section: string): void {
    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      healthData: {
        title: 'Editar Dados de Saúde',
        initialData: {
            ...this.student().healthData,
            ubsName: this.student().healthData?.ubsReference, // Mapeia ubsReference -> ubsName (se o form usar ubsName)
            expirationDate: this.student().healthData?.infoExpirationDate // Mapeia infoExpirationDate -> expirationDate
        },
        formConfig: [
          { name: 'ubsName', label: 'UBS de Referência', type: 'text' },
          {
            name: 'flagUseGlasses', // Mapear wearsGlasses -> flagUseGlasses
            label: 'Utiliza óculos',
            type: 'select',
            options: [
              { value: true, viewValue: 'Sim' },
              { value: false, viewValue: 'Não' },
            ],
          },
          { name: 'expirationDate', label: 'Vencimento das Informações', type: 'date' },
        ],
      },
    };

    if (editFormDataCatalog[section]) {
      const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
        data: editFormDataCatalog[section],
      });

      dialogRef.closed.subscribe((result) => {
        if (result) {
          // Cast para any para evitar erro de tipo com propriedades dinâmicas
          const res = result as any;
          const currentStudent = this.student();
          let updatedStudent = currentStudent;

          if (section === 'healthData') {
            if (!currentStudent.healthData) return;
            updatedStudent = {
                ...currentStudent,
                healthData: {
                    ...currentStudent.healthData,
                    ubsReference: res.ubsName, // Mapeia de volta
                    wearsGlasses: res.flagUseGlasses,
                    infoExpirationDate: res.expirationDate
                }
            };
          }

          // Chama o serviço para persistir a atualização
          this.studentService.updateStudent(updatedStudent).subscribe({
              next: () => {
                  console.log('Estudante atualizado com sucesso');
                  alert('Dados atualizados com sucesso!');
                  this.student.set(updatedStudent);
              },
              error: (err) => {
                  console.error('Erro ao atualizar estudante', err);
                  alert('Erro ao atualizar dados. Tente novamente.');
              }
          });
        }
      });
    }
  }

  getMedicalLocationName(medicalLocationId: number) {
    return MedicalLocationMap[medicalLocationId]?.descricao || 'Outro';
  }
}
