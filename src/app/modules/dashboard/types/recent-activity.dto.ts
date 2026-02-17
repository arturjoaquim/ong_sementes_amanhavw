export interface RecentActivityDTO {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'STUDENT' | 'WORKSHOP' | 'EMPLOYEE';
}
