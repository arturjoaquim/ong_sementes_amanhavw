export interface CreateWorkshopSessionDTO {
  workshopId: number;
  description: string;
  attendanceListLink: string;
  responsibleEducatorId: number;
  studentIds: number[];
}
