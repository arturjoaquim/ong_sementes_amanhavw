import { IndividualPersonDTO } from '../../../shared/types/dtos/individual-person.dto';

export interface EmployeeDetails {
  id: number;
  person: IndividualPersonDTO;
  positionId: number;
  systemUserId: number | null;
}
