import { IndividualPerson } from '../../../shared/types/person.type';
import { Guardian } from './guardian.type';
import { StudentFamily } from './student-family.type';

export interface StudentHealth {
  studentHealthId: number;
  studentId: number;
  ubsName: string;
  flagUseGlasses: string;
  dataExpirationDate: Date;
  medicalNotes: StudentMedicalNote[];
  medicalTreatments: StudentMedicalTreatment[];
}

interface StudentMedicalNote {
  studentMedicalNoteId: number;
  studentHealthId: number;
  medicalNoteTypeId: number;
  descriptionEmergencyProcedure: string;
  summaryNote: string;
  description: string;
  noteDate: Date;
  medicalLocationId: number;
}

interface StudentMedicalTreatment {
  studentMedicalTreatmentId: number;
  studentHealthId: number;
  medicalTreatmentTypeId: number;
  treatmentDescription: string;
}

interface StudentSocialInteraction {
  id: number;
  interactionLevelId: number;
  socialGroupId: number;
  studentId: number;
  socialInteractionPlace: SocialInteractionPlace[];
}

interface SocialInteractionPlace {
  id: number;
  socialInteractionId: number;
  placeId: number;
}

interface SocialActivity {
  id: number;
  name: string;
  socialActivityTypeId: number;
  description: string;
}

export interface StudentDwellingCondition {
  id: number;
  studentId: number;
  parentsMaritalStatusId: number;
  hasSeparatedParentContact: boolean;
  staysHomeAlone: boolean;
  familyId: number;
  family: StudentFamily;
}

interface StudentGuardianRelashionship {
  idRelashionship: number;
  idStudent: number;
  idGuardian: number;
  guardian: Guardian;
}

interface StudentEmergencyContact {
  emergencyContactId: number;
  emergencyContactName: string;
  studentId: number;
  contactTypeId: number;
  contactValue: string;
}

interface StudentNote {
  studentNoteId: number;
  studentId: number;
  summaryNote: string;
  descrition: string;
  noteDate: Date;
  creatorUserId: number;
}

export interface Student {
  id: number;
  personData: IndividualPerson;
  avatar: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive';
  attendance: number;
  periodId: number;
  enrollmentOrigin: string;
  accompaniedStatus?: boolean;
  transportGuardianName?: string;
  emergencyContact: StudentEmergencyContact;
  notes: StudentNote[];
  healthData: StudentHealth;
  dwellingCondition: StudentDwellingCondition;
  socialInteractions: StudentSocialInteraction[];
  guardianRelashionship: StudentGuardianRelashionship[];
  socialActivities: SocialActivity[];
}
