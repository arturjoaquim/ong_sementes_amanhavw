interface Person {
  personId: number;
  personTypeId: number;
}

export interface IndividualPerson extends Person {
  name: string;
  birthDate: Date;
  sexId: number;
  fatherName: string;
  motherName: string;
  raceId: number;
  naturalnessId: number;
  personAddress: PersonAddress;
  personContact: PersonContact[];
  personDocument: PersonDocument[];
  personEducation: IndividualPersonEducation;
}

interface PersonAddress {
  personId: number;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PersonContact {
  personId: number;
  contactTypeId: number;
  contactValue: string;
}

interface PersonDocument {
  personId: number;
  documentTypeId: number;
  documentNumber: string;
  documentData: Record<string, any>;
}

interface IndividualPersonEducation {
  personId: number;
  institutionName: string;
  studyLevelId: number;
  academicPeriodId: number;
  educationStatusId: number;
}
