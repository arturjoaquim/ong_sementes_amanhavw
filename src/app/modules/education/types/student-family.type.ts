interface FamilySocialRisk {
  id: number;
  typeSocialRiskId: number;
  prioritySituation: boolean;
  description: string;
  familyId: number;
}

interface FamilyBenefit {
  id: number;
  benefitTypeId: number;
  familyId: number;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  profession: string;
  income: string;
  kinshipDegreeId: number;
  familyId: number;
}

interface DwellingVisit {
  id: number;
  date: Date;
  summary: string;
  description: string;
  creatorUserId: number;
  familyId: number;
}

export interface StudentFamily {
  id: number;
  typeDwellingId: number;
  crasName: string;
  familyEvaluation: string;
  informationExpirationDate: Date;
  dwellingVisits: DwellingVisit[];
  familyMembers: FamilyMember[];
  familyBenefits: FamilyBenefit[];
  familySocialRisks: FamilySocialRisk[];
}
