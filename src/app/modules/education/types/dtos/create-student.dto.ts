import { IndividualPersonDTO } from '../../../../shared/types/dtos/individual-person.dto';
import { StudentDataDTO } from './student-data.dto';
import { CreateStudentGuardianDTO } from './create-student-guardian.dto';

export interface CreateStudentDTO {
  person: IndividualPersonDTO;
  studentData: StudentDataDTO;
  guardians: CreateStudentGuardianDTO[];
  registrationDate: Date;
}
