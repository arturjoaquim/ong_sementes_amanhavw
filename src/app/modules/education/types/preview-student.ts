export interface StudentPreviewData {
  id: number;
  avatar: string;
  name: string;
  guardian: string;
  guardianPhone: string;
  status: 'active' | 'inactive' | 'graduated';
  attendance: number;
  grade: string;
  age: number;
}
