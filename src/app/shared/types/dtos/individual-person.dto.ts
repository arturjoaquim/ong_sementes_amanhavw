import { PersonAddressDTO } from './person-address.dto';
import { PersonContactDTO } from './person-contact.dto';
import { PersonDocumentDTO } from './person-document.dto';
import { PersonEducationDTO } from './person-education.dto';

export interface IndividualPersonDTO {
  id: number;
  personName: string;
  birthDate: Date;
  motherName: string;
  fatherName: string;
  naturalnessId: number;
  raceId: number;
  sexId: number;
  address: PersonAddressDTO;
  contact: PersonContactDTO;
  education: PersonEducationDTO;
  documents: PersonDocumentDTO[];
}
