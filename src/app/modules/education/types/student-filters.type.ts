export interface StudentFilters {
  studentName?: string;
  guardianName?: string;
  minAge?: number;
  maxAge?: number;
  status?: string;
  limit?: number; // Limitação de resultados
}
