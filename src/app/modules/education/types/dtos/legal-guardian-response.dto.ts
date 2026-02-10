import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';

export interface LegalGuardianResponseDTO {
  id: number;
  person: IndividualPersonDTO;
}
