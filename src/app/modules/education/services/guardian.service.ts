import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalGuardianResponseDTO } from '../types/dtos/legal-guardian-response.dto';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GuardianService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/guardians`;

  /**
   * Cria um novo guardião no backend.
   * Retorna o guardião criado (com ID).
   */
  createGuardian(guardianData: any): Observable<LegalGuardianResponseDTO> {
    // Mapeamento para CreateLegalGuardianDTO
    const dto = {
        person: {
            personName: guardianData.name,
            birthDate: guardianData.birthDate || null,
            sexId: null,
            fatherName: null,
            motherName: null,
            raceId: null,
            naturalnessId: null,
            address: null,
            contact: {
                mobilePhone: guardianData.phone,
                email: guardianData.email || null,
                telephone: null,
                hasWhatsApp: false
            },
            documents: guardianData.cpf ? [{
                documentTypeId: 1, // CPF
                number: guardianData.cpf
            }] : [],
            education: null
        }
    };
    return this.http.post<LegalGuardianResponseDTO>(this.apiUrl, dto);
  }

  updateGuardian(id: number, guardianData: any): Observable<void> {
      const dto = {
          person: {
              personName: guardianData.name,
              birthDate: guardianData.birthDate || null,
              contact: {
                  mobilePhone: guardianData.phone,
                  email: guardianData.email || null
              }
              // Documents removidos, usar PersonDocumentService
          }
      };
      return this.http.patch<void>(`${this.apiUrl}/${id}`, dto);
  }
}
