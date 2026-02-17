import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

export interface UpdateEmployeeDTO {
  person?: Partial<IndividualPersonDTO>;
  positionId?: number;
  systemUserId?: number;
}
