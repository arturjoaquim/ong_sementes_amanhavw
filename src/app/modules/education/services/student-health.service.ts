import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentHealthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  addMedication(studentId: number, medicationData: any): Observable<void> {
    const dto = {
        medicationName: medicationData.medicationName,
        frequency: medicationData.frequency,
        dosage: medicationData.dosage
    };
    return this.http.post<void>(`${this.apiUrl}/${studentId}/health/medications`, dto);
  }

  updateMedication(studentId: number, medicationId: number, medicationData: any): Observable<void> {
    const dto = {
        medicationName: medicationData.medicationName,
        frequency: medicationData.frequency,
        dosage: medicationData.dosage
    };
    return this.http.patch<void>(`${this.apiUrl}/${studentId}/health/medications/${medicationId}`, dto);
  }

  removeMedication(studentId: number, medicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${studentId}/health/medications/${medicationId}`);
  }

  addTreatment(studentId: number, treatmentData: any): Observable<void> {
    const dto = {
        treatmentDescription: treatmentData.description,
        observations: treatmentData.observations,
        monitoringLocationId: treatmentData.monitoringLocationId
    };
    return this.http.post<void>(`${this.apiUrl}/${studentId}/health/treatments`, dto);
  }

  updateTreatment(studentId: number, treatmentId: number, treatmentData: any): Observable<void> {
    const dto = {
        treatmentDescription: treatmentData.description,
        observations: treatmentData.observations,
        monitoringLocationId: treatmentData.monitoringLocationId
    };
    return this.http.patch<void>(`${this.apiUrl}/${studentId}/health/treatments/${treatmentId}`, dto);
  }

  removeTreatment(studentId: number, treatmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${studentId}/health/treatments/${treatmentId}`);
  }
}
