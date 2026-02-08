import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from '../types/student.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudentPreview } from '../types/student-preview.type';
import { StudentFilters } from '../types/student-filters.type';
import { StudentDetailsDTO } from '../types/dtos/student-details.dto';
import { StudentConverter } from '../utils/student.converter';
import { StudentPreviewDTO } from '../types/dtos/student-preview.dto';
import { StudentPreviewConverter } from '../utils/student-preview.converter';
import { CreateStudentDTO } from '../types/dtos/create-student.dto';
import { UpdateStudentDTO } from '../types/dtos/update-student.dto';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/students'; // URL direta

  /**
   * Busca os detalhes completos de um estudante pelo ID.
   * Retorna um Observable que emite o estudante encontrado.
   */
  getStudentDetailsById(id: number): Observable<Student> {
    return this.http.get<StudentDetailsDTO>(`${this.apiUrl}/${id}/details`).pipe(
      map((dto) => StudentConverter.toModel(dto))
    );
  }

  /**
   * Cria um novo estudante no backend.
   * Retorna um Observable que emite o estudante criado (ou void se o back não retornar).
   */
  createStudent(dto: CreateStudentDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }

  /**
   * Atualiza um estudante existente no backend.
   * Retorna um Observable que emite o estudante atualizado (ou void).
   */
  updateStudent(student: Student): Observable<void> {
    const dto: UpdateStudentDTO = StudentConverter.toUpdateDTO(student);
    return this.http.patch<void>(`${this.apiUrl}/${student.id}`, dto);
  }

  /**
   * Inativa um estudante do backend.
   * Retorna um Observable que completa quando a operação termina.
   */
  inactivateStudent(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/inactivate`, {});
  }

  /**
   * Busca estudantes no backend com base em filtros, paginação e ordenação.
   * Cada chamada a este método dispara uma nova requisição HTTP.
   * @param filters Objeto com os filtros a serem aplicados.
   * @returns Um Observable que emite um array de estudantes.
   */
  searchStudentsPreview(filters: StudentFilters): Observable<StudentPreview[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value.toString());
      }
    }

    return this.http.get<StudentPreviewDTO[]>(`${this.apiUrl}/preview`, {
      params,
    }).pipe(
      map((dtos) => dtos.map((dto) => StudentPreviewConverter.toModel(dto)))
    );
  }
}
