import { Component, Input } from '@angular/core';
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
import { DwellingVisit, StudentFamily } from '../../types/student-family.type';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '../../../../shared/components/accordion/accordion-item.component';
import { SectionHeaderComponent } from './section-header.component';

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
  ],
  templateUrl: './student-family-detail.component.html',
})
export class StudentFamilyDetailComponent {
  @Input({ required: true }) student!: Student;

  public openGuardianIndex: number | null = 0;
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

  get guardians(): Guardian[] {
    return this.student.guardianRelashionship.map((rel) => rel.guardian);
  }

  get dwelling(): StudentDwellingCondition {
    return this.student.dwellingCondition;
  }

  get family(): StudentFamily | undefined {
    return this.dwelling.family;
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
      guardian.peopleData.personContact.find((c) => c.contactTypeId === 1)?.contactValue ||
      'Não informado'
    );
  }

  getGuardianCpf(guardian: Guardian): string | undefined {
    return guardian.peopleData.personDocument.find((doc) => doc.documentTypeId === 1)
      ?.documentNumber;
  }

  getGuardianKinship(guardian: Guardian): string {
    // Assumindo IDs: 1-Mãe, 2-Pai, 3-Irmão/Irmã, 4-Avó/Avô, 5-Tio/Tia
    switch (guardian.kinshipDegreeId) {
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

  editData(section: string): void {
    // Lógica para edição. Ex: abrir um modal específico.
    console.log(`Editar seção: ${section}`);
  }
}
