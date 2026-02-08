export interface Person {
  id: number;
  personTypeId: number | null;
}

export interface IndividualPerson extends Person {
  personName: string;
  birthDate: Date;
  sexId: number;
  fatherName: string;
  motherName: string;
  raceId: number;
  naturalnessId: number;
  address?: PersonAddress;
  contact?: PersonContact;
  documents: PersonDocument[];
  education?: IndividualPersonEducation;
}

export interface PersonAddress {
  id: number;
  street: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  cep: string;
}

export interface PersonContact {
  id: number;
  email: string;
  telephone: string;
  mobilePhone: string;
  hasWhatsApp: boolean;
}

export interface PersonDocument {
  id: number;
  documentTypeId: number;
  number: string;
  active: boolean | null;
  documentDetail: Record<string, any> | null;
}

export interface IndividualPersonEducation {
  id: number;
  institution: string;
  educationLevelId: number;
  periodId: number;
  educationStatusId: number;
}
