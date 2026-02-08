import { IndividualPersonDTO } from './individual-person.dto';
import { StudentDataDTO } from './student-data.dto';

export interface UpdateStudentDTO {
  studentData?: Partial<StudentDataDTO>;
  person?: Partial<IndividualPersonDTO>;
  active?: boolean;
}
