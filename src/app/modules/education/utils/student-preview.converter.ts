import { StudentPreview } from '../types/student-preview.type';
import { StudentPreviewDTO } from '../types/dtos/student-preview.dto';
import { SchoolGradeMap } from '../../../shared/utils/lookup.enums';

export class StudentPreviewConverter {
  static toModel(dto: StudentPreviewDTO): StudentPreview {
    return {
      id: dto.id,
      avatar: '',
      name: dto.studentName,
      guardian: dto.guardianName,
      guardianPhone: dto.guardianPhone,
      status: dto.status as 'active' | 'inactive' | 'graduated',
      attendance: dto.attendance,
      grade: SchoolGradeMap[dto.educationLevelId]?.descricao || 'Não informado',
      age: dto.age,
    };
  }
}
