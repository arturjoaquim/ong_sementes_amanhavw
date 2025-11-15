
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workshop } from '../types/workshop.type';

@Injectable({
  providedIn: 'root',
})
export class WorkshopService {
  private workshopsSubject = new BehaviorSubject<Workshop[]>(initialWorkshops);
  public workshops$ = this.workshopsSubject.asObservable();

  getWorkshops(): Observable<Workshop[]> {
    return this.workshops$;
  }

  getWorkshopById(id: string): Workshop | undefined {
    return this.workshopsSubject.value.find((w) => w.id === id);
  }

  createWorkshop(workshop: Workshop): void {
    const workshops = this.workshopsSubject.value;
    this.workshopsSubject.next([...workshops, workshop]);
  }

  updateWorkshop(workshop: Workshop): void {
    const workshops = this.workshopsSubject.value;
    const index = workshops.findIndex((w) => w.id === workshop.id);
    if (index !== -1) {
      workshops[index] = workshop;
      this.workshopsSubject.next([...workshops]);
    }
  }

  deleteWorkshop(id: string): void {
    const workshops = this.workshopsSubject.value.filter((w) => w.id !== id);
    this.workshopsSubject.next(workshops);
  }

  searchWorkshops(filters: any): Workshop[] {
    let workshops = this.workshopsSubject.value;

    if (filters.nameSearch) {
      workshops = workshops.filter((w) =>
        w.name.toLowerCase().includes(filters.nameSearch.toLowerCase())
      );
    }

    if (filters.educatorSearch) {
      workshops = workshops.filter((w) =>
        w.educatorName.toLowerCase().includes(filters.educatorSearch.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      workshops = workshops.filter((w) => w.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      workshops = workshops.filter((w) => w.type === filters.type);
    }

    return workshops;
  }
}

export const initialWorkshops: Workshop[] = [
  {
    id: 'WRK-001',
    name: 'Oficina de Artes Visuais',
    description: 'Desenvolvimento de habilidades artísticas através de diversas técnicas de pintura, desenho e escultura.',
    educatorId: 'EDU-001',
    educatorName: 'Maria Silva',
    type: 'Artes',
    schedule: [
      { dayOfWeek: 'Segunda-feira', startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 'Quarta-feira', startTime: '14:00', endTime: '16:00' },
    ],
    participants: ['STU-001', 'STU-003', 'STU-005'],
    maxParticipants: 15,
    status: 'active',
    startDate: '2025-01-15',
    location: 'Sala de Artes - Bloco A',
    attendanceListUrl: 'https://example.com/attendance/wrk-001',
  },
  {
    id: 'WRK-002',
    name: 'Oficina de Música e Canto',
    description: 'Aprendizado de teoria musical, canto coral e prática com instrumentos musicais.',
    educatorId: 'EDU-002',
    educatorName: 'João Santos',
    type: 'Música',
    schedule: [
      { dayOfWeek: 'Terça-feira', startTime: '15:00', endTime: '17:00' },
      { dayOfWeek: 'Quinta-feira', startTime: '15:00', endTime: '17:00' },
    ],
    participants: ['STU-002', 'STU-004', 'STU-006', 'STU-007'],
    maxParticipants: 20,
    status: 'active',
    startDate: '2025-01-20',
    location: 'Auditório Principal',
  },
  {
    id: 'WRK-003',
    name: 'Oficina de Teatro e Expressão Corporal',
    description: 'Exploração de técnicas teatrais, improvisação e desenvolvimento da expressão corporal.',
    educatorId: 'EDU-003',
    educatorName: 'Ana Paula Costa',
    type: 'Teatro',
    schedule: [
      { dayOfWeek: 'Sexta-feira', startTime: '14:00', endTime: '17:00' },
    ],
    participants: ['STU-003', 'STU-008', 'STU-009'],
    maxParticipants: 12,
    status: 'active',
    startDate: '2025-02-01',
    location: 'Teatro Municipal',
  },
  {
    id: 'WRK-004',
    name: 'Oficina de Informática Básica',
    description: 'Introdução à informática, uso de aplicativos de escritório e navegação na internet.',
    educatorId: 'EDU-004',
    educatorName: 'Carlos Roberto',
    type: 'Tecnologia',
    schedule: [
      { dayOfWeek: 'Segunda-feira', startTime: '09:00', endTime: '11:00' },
      { dayOfWeek: 'Quarta-feira', startTime: '09:00', endTime: '11:00' },
      { dayOfWeek: 'Sexta-feira', startTime: '09:00', endTime: '11:00' },
    ],
    participants: ['STU-001', 'STU-002', 'STU-005', 'STU-010'],
    maxParticipants: 18,
    status: 'active',
    startDate: '2025-01-10',
    location: 'Laboratório de Informática',
  },
  {
    id: 'WRK-005',
    name: 'Oficina de Esportes e Recreação',
    description: 'Práticas esportivas diversas, jogos recreativos e desenvolvimento de trabalho em equipe.',
    educatorId: 'EDU-005',
    educatorName: 'Pedro Oliveira',
    type: 'Esportes',
    schedule: [
      { dayOfWeek: 'Terça-feira', startTime: '16:00', endTime: '18:00' },
      { dayOfWeek: 'Quinta-feira', startTime: '16:00', endTime: '18:00' },
    ],
    participants: ['STU-002', 'STU-004', 'STU-006', 'STU-008'],
    maxParticipants: 25,
    status: 'active',
    startDate: '2025-01-18',
    location: 'Quadra Poliesportiva',
  },
  {
    id: 'WRK-006',
    name: 'Oficina de Leitura e Escrita Criativa',
    description: 'Estímulo à leitura e desenvolvimento de habilidades de escrita criativa e produção textual.',
    educatorId: 'EDU-006',
    educatorName: 'Fernanda Lima',
    type: 'Literatura',
    schedule: [
      { dayOfWeek: 'Quarta-feira', startTime: '10:00', endTime: '12:00' },
    ],
    participants: ['STU-003', 'STU-005', 'STU-007'],
    maxParticipants: 15,
    status: 'active',
    startDate: '2025-01-25',
    location: 'Biblioteca',
  },
  {
    id: 'WRK-007',
    name: 'Oficina de Culinária Saudável',
    description: 'Aprendizado de técnicas culinárias básicas com foco em alimentação saudável e sustentável.',
    educatorId: 'EDU-007',
    educatorName: 'Luciana Rodrigues',
    type: 'Gastronomia',
    schedule: [
      { dayOfWeek: 'Sexta-feira', startTime: '10:00', endTime: '13:00' },
    ],
    participants: ['STU-001', 'STU-004', 'STU-009'],
    maxParticipants: 10,
    status: 'inactive',
    startDate: '2024-11-01',
    endDate: '2024-12-20',
    location: 'Cozinha Comunitária',
  },
];
