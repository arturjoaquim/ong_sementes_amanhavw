import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentGuardianService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/students';

  addGuardian(studentId: number, guardianId: number, kinshipId: number): Observable<void> {
    const dto = {
        guardianId: guardianId,
        kinshipId: kinshipId
    };
    return this.http.post<void>(`${this.apiUrl}/${studentId}/guardians`, dto);
  }

  updateGuardian(studentId: number, guardianId: number, kinshipId: number): Observable<void> {
    const dto = {
        kinshipId: kinshipId
    };
    return this.http.patch<void>(`${this.apiUrl}/${studentId}/guardians/${guardianId}`, dto);
  }

  removeGuardian(studentId: number, guardianId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${studentId}/guardians/${guardianId}`);
  }
}
