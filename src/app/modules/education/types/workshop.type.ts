export interface Workshop {
  id: number;
  name: string;
  enrollmentLimit: number;
  active: boolean;
  sessions: WorkshopSession[];
  enrolledStudents: WorkshopParticipant[]; // Alunos matriculados na oficina
}

export interface WorkshopSession {
  id: number;
  description: string;
  attendanceListLink: string;
  responsibleEducatorId: number;
  responsibleEducatorName: string;
  participantsCount: number;
  presences: WorkshopPresence[];
}

export interface WorkshopParticipant {
  id: number;
  studentId: number;
  studentName: string;
}

export interface WorkshopPresence {
  id: number;
  studentId: number;
  studentName: string;
}
