import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';
import { StudentDataDTO } from './student-data.dto';

export interface UpdateStudentDTO {
  studentData?: Partial<StudentDataDTO>;
  person?: Partial<IndividualPersonDTO>;
  active?: boolean;
}
