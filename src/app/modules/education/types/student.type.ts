export interface MedicalData {
  physicalActivityRestrictions: string;
  dietaryRestrictions: string;
  disabilities: string;
  dentalCare: boolean;
  ophthalmologicalCare: boolean;
  allergies: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  profession: string;
  income: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  days: string[];
  organization?: string;
}

export interface SocialRiskData {
  childProtectiveServices: boolean;
  prisonSystem: boolean;
  policeStation: boolean;
  emergencyRoom: boolean;
  rehabilitationCenter: boolean;
  womensPoliceStation: boolean;
  otherServices: string;
  hasPrioritySituation: boolean;
  situationCode: string;
  observations: string;
}

export interface FamilyData {
  members: FamilyMember[];
  maritalStatus: string;
  separated: boolean;
  contactWithSeparatedSpouse: string;
  contactFrequency: string;
  housingType: string;
  benefits: {
    bolsaFamilia: boolean;
    rendaCidada: boolean;
    bpc: boolean;
    other: string;
  };
  familyAssessment: string;
  activities: Activity[];
  socialRisk?: SocialRiskData;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  age: number;
  grade: string;
  guardian: string;
  guardianPhone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  attendance: number;
  cpf?: string;
  race?: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  enrollmentOrigin?: string;
  accompaniedStatus?: string;
  medicalData?: MedicalData;
  familyData?: FamilyData;
}
