import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-student-general-detail',
  standalone: true,
  imports: [CommonModule, CardComponent, DetailFieldComponent, SectionHeaderComponent],
  templateUrl: './student-general-detail.component.html',
})
export class StudentGeneralDetailComponent {
  @Input({ required: true }) student!: Student;

  icons: Record<string, LucideIconData> = {
    graduationCap: GraduationCap,
    mapPin: MapPin,
    calendar: Calendar,
    users: Users,
    userCircle: UserCircle,
    fileText: FileText,
  };

  // --- Getters para Dados da Matrícula ---
  get period(): string {
    switch (this.student.periodId) {
      case 1:
        return 'Manhã';
      case 2:
        return 'Tarde';
      default:
        return 'Não informado';
    }
  }

  // --- Getters para Dados Pessoais ---
  get birthDate(): Date {
    return this.student.personData.birthDate;
  }

  get gender(): string {
    switch (this.student.personData.sexId) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Feminino';
      default:
        return 'Não informado';
    }
  }

  get race(): string {
    switch (this.student.personData.raceId) {
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
    switch (this.student.personData.naturalnessId) {
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
    return this.student.personData.fatherName || 'Não informado';
  }

  get motherName(): string {
    return this.student.personData.motherName || 'Não informado';
  }

  // --- Getters para Documentos ---
  get cpf(): string | undefined {
    return this.student.personData.personDocument.find((doc) => doc.documentTypeId === 1)
      ?.documentNumber;
  }

  get rg(): string | undefined {
    return this.student.personData.personDocument.find((doc) => doc.documentTypeId === 2)
      ?.documentNumber;
  }

  get birthCertificate(): { number: string; book: string; page: string } | undefined {
    const cert = this.student.personData.personDocument.find((doc) => doc.documentTypeId === 3);
    if (!cert) return undefined;
    return {
      number: cert.documentNumber,
      book: cert.documentData['book'] || 'N/A',
      page: cert.documentData['page'] || 'N/A',
    };
  }

  get nisNumber(): string {
    return (
      this.student.personData.personDocument.find((doc) => doc.documentTypeId === 4)
        ?.documentNumber || 'Não informado'
    );
  }

  // --- Getters para Endereço ---
  get fullStreet(): string {
    const addr = this.student.personData.personAddress;
    if (!addr) return 'Não informado';
    let addressString = `${addr.street}, ${addr.number}`;
    if (addr.complement) {
      addressString += ` - ${addr.complement}`;
    }
    return addressString;
  }

  get neighborhood(): string {
    return this.student.personData.personAddress?.neighborhood || 'Não informado';
  }

  get city(): string {
    return this.student.personData.personAddress?.city || 'Não informado';
  }

  get state(): string {
    return this.student.personData.personAddress?.state || 'Não informado';
  }

  get zipCode(): string {
    return this.student.personData.personAddress?.zipCode || 'Não informado';
  }

  editData(section: string): void {
    // Lógica para edição. Ex: abrir um modal específico.
    console.log(`Editar seção: ${section}`);
  }
}
