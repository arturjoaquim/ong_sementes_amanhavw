import { IndividualPerson } from '../../../shared/types/person.type';
import { Guardian } from './guardian.type';
import { StudentFamily } from './student-family.type';

export interface StudentHealth {
  id: number;
  studentId: number;
  ubsReference: string;
  wearsGlasses: boolean;
  infoExpirationDate: Date;
  medications: StudentMedication[];
  treatments: StudentMedicalTreatment[];
}

export interface StudentMedication {
  id: number;
  medicationName: string;
  frequency: string;
  dosage: string;
}

export interface StudentMedicalTreatment {
  id: number;
  treatmentDescription: string;
  observations: string;
  monitoringLocationId: number;
}

interface StudentSocialInteraction {
  id: number;
  interactionLevelId: number;
  socialGroupId: number;
  studentId: number;
  socialInteractionPlace: SocialInteractionPlace[];
}

export interface SocialInteractionPlace {
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
  description: string;
  familyId: number;
  family: StudentFamily;
}

interface StudentGuardianRelashionship {
  studentId: number;
  guardianId: number;
  kinshipId: number;
  guardian: Guardian;
}

interface StudentEmergencyContact {
  id: number;
  email: string;
  telephone: string;
  mobilePhone: string;
  hasWhatsApp: boolean;
}

interface StudentNote {
  id: number;
  studentId: number;
  summary: string;
  description: string;
  date: Date;
  creatorId: number;
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
  healthData: StudentHealth | null;
  dwellingCondition: StudentDwellingCondition | null;
  socialInteractions: StudentSocialInteraction[];
  guardianRelashionship: StudentGuardianRelashionship[];
  socialActivities: SocialActivity[];
}
