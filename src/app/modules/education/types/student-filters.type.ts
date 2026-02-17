export interface StudentFilters {
  nameSearch?: string;
  name?: string; // Alias para nameSearch ou filtro específico por nome
  guardianSearch?: string;
  status?: string;
  ageMin?: string;
  ageMax?: string;
  limit?: number; // Limitação de resultados
}
