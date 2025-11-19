import { IndividualPerson } from '../../../shared/types/person.type';

export interface Guardian {
  id: number;
  peopleData: IndividualPerson;
  kinshipDegreeId: number;
}
