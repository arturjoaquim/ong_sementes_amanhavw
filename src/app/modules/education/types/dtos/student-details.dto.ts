export interface AddressDTO {
  cep: string;
  streetNumber: string;
  street: string;
  neighborhood: string;
  city: string;
  complement: string;
  uf: string;
}

export interface ContactDTO {
  telephone: string;
  mobilePhone: string;
  hasWhatsApp: boolean;
  email: string;
}

export interface EducationDTO {
  institution: string;
  periodId: number;
  educationLevelId: number;
  educationStatusId: number;
}

export interface DocumentDTO {
  documentTypeId: number;
  number: string;
  extraData: {
    book?: string;
    term?: string;
    sheet?: string;
  } | null;
  active: boolean | null;
}

export interface PersonDataDTO {
  personName: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  naturalnessId: number;
  raceId: number;
  sexId: number;
  address: AddressDTO;
  contact: ContactDTO;
  education: EducationDTO;
  documents: DocumentDTO[];
}

export interface EmergencyContactDTO {
  telephone: string;
  mobilePhone: string;
  hasWhatsApp: boolean;
  email: string;
}

export interface GuardianPersonDTO {
  personName: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  naturalnessId: number;
  raceId: number;
  sexId: number;
  address: AddressDTO;
  contact: ContactDTO;
  education: EducationDTO;
  documents: DocumentDTO[];
}

export interface GuardianRelationshipDTO {
  id: number;
  kinshipId: number;
  legalGuardianId: number | null;
  person: GuardianPersonDTO;
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
  personData: PersonDataDTO;
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
