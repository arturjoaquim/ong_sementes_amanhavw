
export interface Workshop {
  id: string;
  name: string;
  description: string;
  educatorId: string;
  educatorName: string;
  type: string;
  schedule: WorkshopSchedule[];
  participants: string[];
  maxParticipants: number;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate?: string;
  location: string;
  attendanceListUrl?: string;
}

export interface WorkshopSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
