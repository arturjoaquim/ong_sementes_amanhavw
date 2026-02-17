import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

export interface EmployeeResponseDTO {
  id: number;
  person: IndividualPersonDTO;
  positionId: number;
  systemUserId: number;
}
