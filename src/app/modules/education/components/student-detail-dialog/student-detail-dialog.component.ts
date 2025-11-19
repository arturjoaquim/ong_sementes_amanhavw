import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LucideAngularModule,
  Users,
  ChevronDown,
  GraduationCap,
  X,
  Calendar,
  FileText,
  MapPin,
  UserCircle,
  Phone,
} from 'lucide-angular';
import { Student } from '../../types/student.type';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import {
  AvatarComponent,
  AvatarFallbackComponent,
} from '../../../../shared/components/avatar/avatar.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Guardian } from '../../types/guardian.type';
import { StudentDwellingCondition } from '../../types/student.type';
import { StudentFamily } from '../../types/student-family.type';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-student-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogDescriptionComponent,
    DialogTitleComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    BadgeComponent,
    CardComponent,
  ],
  templateUrl: './student-detail-dialog.component.html',
})
export class StudentDetailDialogComponent {
  private dialogRef = inject(DialogRef<void>);
  public data = inject<{ student: Student }>(DIALOG_DATA);
  public student: Student = this.data.student;

  icons = {
    users: Users,
    graduationCap: GraduationCap,
    x: X,
    calendar: Calendar,
    fileText: FileText,
    mapPin: MapPin,
    userCircle: UserCircle,
    phone: Phone,
    chevronDown: ChevronDown,
  };

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.student.personData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // --- Getters para Dados Pessoais ---
  get name(): string {
    return this.student.personData.name;
  }

  get birthDate(): Date {
    return this.student.personData.birthDate;
  }

  get cpf(): string | undefined {
    return this.student.personData.personDocument.find((doc) => doc.documentTypeId === 1)
      ?.documentNumber;
  }

  get rg(): string | undefined {
    // Assumindo que o documentTypeId para RG seja 2
    return this.student.personData.personDocument.find((doc) => doc.documentTypeId === 2)
      ?.documentNumber;
  }

  get birthCertificate(): { number: string; book: string; page: string } | undefined {
    // Assumindo que o documentTypeId para Certidão de Nascimento seja 3
    const cert = this.student.personData.personDocument.find((doc) => doc.documentTypeId === 3);
    if (!cert) return undefined;
    return {
      number: cert.documentNumber,
      book: cert.documentData['book'] || 'N/A',
      page: cert.documentData['page'] || 'N/A',
    };
  }

  get gender(): string {
    // Assumindo 1 para Masculino, 2 para Feminino
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
    // Assumindo IDs: 1-Branca, 2-Parda, 3-Amarela, 4-Preta, 5-Indígena
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
    // Assumindo IDs para cidades
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

  get nisNumber(): string {
    // Assumindo que o documentTypeId para NIS seja 4
    return (
      this.student.personData.personDocument.find((doc) => doc.documentTypeId === 4)
        ?.documentNumber || 'Não informado'
    );
  }

  // --- Getters para Responsável e Família ---
  get guardians(): Guardian[] {
    return this.student.guardianRelashionship.map((rel) => rel.guardian);
  }

  getGuardianPhone(guardian: Guardian): string {
    return (
      guardian.peopleData.personContact.find((c) => c.contactTypeId === 1)?.contactValue ||
      'Não informado'
    );
  }

  getGuardianCpf(guardian: Guardian): string | undefined {
    // Assumindo que o documentTypeId para CPF seja 1
    return guardian.peopleData.personDocument.find((doc) => doc.documentTypeId === 1)
      ?.documentNumber;
  }

  getGuardianEmail(guardian: Guardian): string {
    // Assumindo que o contactTypeId para E-mail seja 2
    return (
      guardian.peopleData.personContact.find((c) => c.contactTypeId === 2)?.contactValue ||
      'Não informado'
    );
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

  get fatherName(): string {
    return this.student.personData.fatherName || 'Não informado';
  }

  get motherName(): string {
    return this.student.personData.motherName || 'Não informado';
  }

  get dwelling(): StudentDwellingCondition {
    return this.student.dwellingCondition;
  }

  get family(): StudentFamily | undefined {
    return this.dwelling.family;
  }

  // --- Getters para Dados da Matrícula ---
  get period(): string {
    // Assumindo 1 para Manhã, 2 para Tarde
    switch (this.student.periodId) {
      case 1:
        return 'Manhã';
      case 2:
        return 'Tarde';
      default:
        return 'Não informado';
    }
  }

  get enrollmentOrigin(): string {
    return this.student.enrollmentOrigin;
  }

  get enrollmentDate(): Date {
    return this.student.enrollmentDate;
  }

  get accompaniedStatus(): boolean | undefined {
    return this.student.accompaniedStatus;
  }

  get transportGuardianName(): string | undefined {
    return this.student.transportGuardianName;
  }

  // --- Lógica para Accordion de Responsáveis ---
  public openGuardianIndex: number | null = 0; // Deixa o primeiro aberto por padrão

  toggleGuardian(index: number): void {
    this.openGuardianIndex = this.openGuardianIndex === index ? null : index;
  }

  close(): void {
    this.dialogRef.close();
  }

  getAttendanceColor(attendance: number): string {
    return attendance >= 90
      ? 'text-green-600'
      : attendance >= 75
        ? 'text-orange-600'
        : 'text-red-600';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
