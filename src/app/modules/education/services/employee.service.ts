import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeResponseDTO } from '../types/dtos/employee-response.dto';
import { EmployeePreview } from '../types/employee-preview.type';
import { EmployeeFilters } from '../types/employee-filters.type';
import { CreateEmployeeDTO } from '../types/dtos/create-employee.dto';
import { UpdateEmployeeDTO } from '../types/dtos/update-employee.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/employees';

  getEmployeeByUserId(userId: number): Observable<EmployeeResponseDTO> {
    return this.http.get<EmployeeResponseDTO>(`${this.apiUrl}/user/${userId}`);
  }

  getEmployeesPreview(): Observable<EmployeePreview[]> {
    return this.http.get<EmployeePreview[]>(`${this.apiUrl}/preview`);
  }

  searchEmployees(filters: EmployeeFilters): Observable<EmployeePreview[]> {
    // Por enquanto, busca todos e filtra no front se o back não suportar filtros no preview
    // O ideal é passar params para o backend
    return this.getEmployeesPreview();
  }

  getEmployeeById(id: number): Observable<EmployeeResponseDTO> {
    return this.http.get<EmployeeResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createEmployee(dto: CreateEmployeeDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  updateEmployee(id: number, dto: UpdateEmployeeDTO): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dto);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
