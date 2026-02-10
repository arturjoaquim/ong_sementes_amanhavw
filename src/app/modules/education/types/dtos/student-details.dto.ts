import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

export interface EmergencyContactDTO {
  telephone: string;
  mobilePhone: string;
  hasWhatsApp: boolean;
  email: string;
}

export interface GuardianRelationshipDTO {
  id: number;
  kinshipId: number;
  legalGuardianId: number | null;
  person: IndividualPersonDTO;
}

export interface SocialActivityDTO {
  id: number;
  workshopId: number;
  studentId: number;
}

export interface StudentNoteResponseDTO {
  id: number;
  positive: boolean;
  summary: string;
  fullDescription: string;
  occurrenceDate: string;
  registeredByName: string;
}

export interface StudentMedicationResponseDTO {
  id: number;
  medicationName: string;
  frequency: string;
  dosage: string;
}

export interface MedicalTreatmentResponseDTO {
  id: number;
  treatmentDescription: string;
  observations: string;
  monitoringLocationId: number;
}

export interface StudentHealthResponseDTO {
  id: number;
  ubsReference: string;
  wearsGlasses: boolean;
  infoExpirationDate: string;
  medications: StudentMedicationResponseDTO[];
  treatments: MedicalTreatmentResponseDTO[];
}

export interface FamilyMemberResponseDTO {
  id: number;
  name: string;
  kinshipId: number;
  profession: string;
  monthlyIncome: number;
}

export interface FamilyBenefitResponseDTO {
  benefitId: number;
}

export interface FamilyRiskResponseDTO {
  id: number;
  description: string;
  isPriority: boolean;
}

export interface HomeVisitResponseDTO {
  id: number;
  visitDate: string;
  summary: string;
  fullReport: string;
  visitorId: number;
}

export interface FamilyResponseDTO {
  id: number;
  domicileTypeId: number;
  familyAssessment: string;
  infoExpirationDate: string;
  referenceCras: string;
  members: FamilyMemberResponseDTO[];
  benefits: FamilyBenefitResponseDTO[];
  risks: FamilyRiskResponseDTO[];
  homeVisits: HomeVisitResponseDTO[];
}

export interface HomeConditionResponseDTO {
  id: number;
  family: FamilyResponseDTO;
  parentsMaritalStatusId: number;
  keepsContactWithSpouse: boolean;
  staysAloneAtHome: boolean;
}

export interface SocialInteractionResponseDTO {
  id: number;
  interactionLevel: number;
  socialGroupDescription: string;
}

export interface StudentDetailsDTO {
  id: number;
  personData: IndividualPersonDTO;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  attendance: number;
  periodId: number;
  registrationOriginId: number;
  accompaniedStatus: boolean;
  transportGuardianName: string;
  emergencyContact: EmergencyContactDTO;
  notes: StudentNoteResponseDTO[];
  healthData: StudentHealthResponseDTO | null;
  dwellingCondition: HomeConditionResponseDTO | null;
  socialInteractions: SocialInteractionResponseDTO[];
  guardianRelashionship: GuardianRelationshipDTO[];
  socialActivities: SocialActivityDTO[];
}
