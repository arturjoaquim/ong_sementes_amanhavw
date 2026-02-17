import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workshop } from '../types/workshop.type';
import { HttpClient } from '@angular/common/http';
import { WorkshopPreviewDTO } from '../types/dtos/workshop-preview.dto';
import { CreateWorkshopDTO } from '../types/dtos/create-workshop.dto';
import { CreateWorkshopSessionDTO } from '../types/dtos/create-workshop-session.dto';

@Injectable({
  providedIn: 'root',
})
export class WorkshopService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/workshops';

  private workshopsSubject = new BehaviorSubject<Workshop[]>([]);
  public workshops$ = this.workshopsSubject.asObservable();

  getWorkshopsPreview(): Observable<WorkshopPreviewDTO[]> {
    return this.http.get<WorkshopPreviewDTO[]>(`${this.apiUrl}/preview`);
  }

  getWorkshopById(id: number): Observable<Workshop> {
    return this.http.get<Workshop>(`${this.apiUrl}/${id}`);
  }

  createWorkshop(workshop: Partial<Workshop>): Observable<Workshop> {
    const dto: CreateWorkshopDTO = {
        name: workshop.name!,
        enrollmentLimit: workshop.enrollmentLimit!,
        active: workshop.active!
    };
    return this.http.post<Workshop>(this.apiUrl, dto);
  }

  createSession(dto: CreateWorkshopSessionDTO): Observable<any> {
      return this.http.post(`${this.apiUrl}/sessions`, dto);
  }

  // Métodos antigos mantidos para compatibilidade temporária ou refatoração futura
  getWorkshops(): Observable<Workshop[]> {
    return this.workshops$;
  }

  updateWorkshop(workshop: Workshop): void {
    // Implementar chamada ao backend
  }

  deleteWorkshop(id: number): void {
    // Implementar chamada ao backend
  }

  searchWorkshops(filters: any): Workshop[] {
    // Implementar busca no backend
    return [];
  }
}
