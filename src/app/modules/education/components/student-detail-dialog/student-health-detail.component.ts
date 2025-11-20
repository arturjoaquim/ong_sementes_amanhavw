import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Student } from '../../types/student.type';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '../../../../shared/components/accordion/accordion-item.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { DetailFieldComponent } from './detail-field.component';
import { Calendar, Glasses, House } from 'lucide-angular';
import { SectionHeaderComponent } from './section-header.component';
import {
  DynamicFormDialogComponent,
  DynamicFormDialogData,
} from '../../../../shared/dynamic-form-dialog/dynamic-form-dialog.component';

@Component({
  selector: 'app-student-health-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    AccordionComponent,
    AccordionHeaderComponent,
    AccordionBodyComponent,
    BadgeComponent,
    DetailFieldComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './student-health-detail.component.html',
})
export class StudentHealthDetailComponent {
  @Input({ required: true }) student!: Student;
  private dialog = inject(Dialog);
  icons = {
    house: House,
    glasses: Glasses,
    calendar: Calendar,
  };
  openMedicalNoteIndex: number | null = null;
  openMedicalTreatmentIndex: number | null = null;

  toggleMedicalNote(index: number) {
    this.openMedicalNoteIndex = this.openMedicalNoteIndex === index ? null : index;
  }

  toggleMedicalTreatment(index: number) {
    this.openMedicalTreatmentIndex = this.openMedicalTreatmentIndex === index ? null : index;
  }

  editData(section: string): void {
    const editFormDataCatalog: Record<string, DynamicFormDialogData> = {
      healthData: {
        title: 'Editar Dados de Saúde',
        initialData: this.student.healthData,
        formConfig: [
          { name: 'ubsName', label: 'UBS de Referência', type: 'text' },
          {
            name: 'flagUseGlasses',
            label: 'Utiliza óculos',
            type: 'select',
            options: [
              { value: 'Sim', viewValue: 'Sim' },
              { value: 'Não', viewValue: 'Não' },
            ],
          },
          { name: 'dataExpirationDate', label: 'Vencimento das Informações', type: 'date' },
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
        }
      });
    }
  }

  getMedicalNoteBadgeColor(medicalNoteType: string) {
    switch (medicalNoteType) {
      case 'Restrição Alimentar':
        return 'bg-orange-100 text-orange-700';
      case 'Doença Crônica':
        return 'bg-orange-100 text-orange-700';
      case 'Restrição Atividade Física':
        return 'bg-yellow-100 text-yellow-700';
      case 'Alergia':
        return 'bg-red-100 text-red-700';
      case 'Deficiência':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getMedicalNoteTypeName(medicalNoteTypeId: number) {
    switch (medicalNoteTypeId) {
      case 1:
        return 'Restrição Alimentar';
      case 2:
        return 'Doença Crônica';
      case 3:
        return 'Restrição Atividade Física';
      case 4:
        return 'Alergia';
      case 5:
        return 'Deficiência';
      default:
        return 'Outro';
    }
  }

  getMedicalTreatmentName(medicalTreatmentId: number) {
    switch (medicalTreatmentId) {
      case 1:
        return 'Oftamológico';
      case 2:
        return 'Odontológico';
      case 3:
        return 'Fisioterapia';
      default:
        return 'Outro';
    }
  }

  getMedicalLocationName(medicalLocationId: number) {
    switch (medicalLocationId) {
      case 1:
        return 'UBS';
      case 2:
        return 'Hospital Geral';
      case 3:
        return 'CAPS';
      case 4:
        return 'SER';
      default:
        return 'Outro';
    }
  }
}
