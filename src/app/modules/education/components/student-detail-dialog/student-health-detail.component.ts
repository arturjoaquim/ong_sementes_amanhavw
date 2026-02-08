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
import { MedicalLocationMap } from '../../../../shared/utils/lookup.enums';
import { StudentService } from '../../services/student.service';

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
    console.log('Adicionar novo medicamento');
    // Implementar lógica de adição
  }

  addTreatment() {
    console.log('Adicionar novo tratamento');
    // Implementar lógica de adição
  }

  editMedication(medication: any) {
    console.log('Editar medicamento:', medication);
    // Implementar lógica de edição
  }

  removeMedication(medicationId: number) {
    console.log('Remover medicamento com ID:', medicationId);
    // Implementar lógica de remoção
  }

  editTreatment(treatment: any) {
    console.log('Editar tratamento:', treatment);
    // Implementar lógica de edição
  }

  removeTreatment(treatmentId: number) {
    console.log('Remover tratamento com ID:', treatmentId);
    // Implementar lógica de remoção
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
