import { StudentPreviewConverter } from './student-preview.converter';
import { StudentPreviewDTO } from '../types/dtos/student-preview.dto';

describe('StudentPreviewConverter', () => {
  it('should not leak student name to external Dicebear API', () => {
    const dto: StudentPreviewDTO = {
      id: 1,
      studentName: 'Ana Clara Souza',
      status: 'active',
      attendance: 95,
      educationLevelId: 2,
      guardianName: 'Maria Souza',
      guardianPhone: '11999998888',
      age: 9,
    };

    const model = StudentPreviewConverter.toModel(dto);

    expect(model.name).toBe('Ana Clara Souza');
    expect(model.avatar).not.toContain('api.dicebear.com');
    expect(model.avatar).not.toContain('Ana Clara Souza');
  });
});
