import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

export interface CreateEmployeeDTO {
  person: IndividualPersonDTO;
  positionId: number;
  systemUserId?: number;
}
