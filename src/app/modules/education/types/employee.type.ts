import { IndividualPerson } from '../../../shared/types/person.type';

export interface Employee {
  id: number;
  personData: IndividualPerson;
  positionId: number;
  systemUserId?: number;
  active: boolean;
}
