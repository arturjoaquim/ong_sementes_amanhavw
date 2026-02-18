import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonDocumentDTO } from '../../../shared/types/dtos/person-document.dto';
import {environment} from '../../../../enviroments/environment';


@Injectable({
  providedIn: 'root',
})
export class PersonDocumentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/people`;

  getDocuments(personId: number): Observable<PersonDocumentDTO[]> {
      return this.http.get<PersonDocumentDTO[]>(`${this.apiUrl}/${personId}/documents`);
  }

  createDocument(personId: number, documentData: any): Observable<void> {
    const dto = {
        documentTypeId: documentData.documentTypeId,
        number: documentData.number,
        extraData: documentData.extraData || null
    };
    return this.http.post<void>(`${this.apiUrl}/${personId}/documents`, dto);
  }

  updateDocument(personId: number, documentId: number, documentData: any): Observable<void> {
    const dto = {
        documentTypeId: documentData.documentTypeId,
        number: documentData.number,
        extraData: documentData.extraData || null
    };
    return this.http.patch<void>(`${this.apiUrl}/${personId}/documents/${documentId}`, dto);
  }

  deleteDocument(personId: number, documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${personId}/documents/${documentId}`);
  }
}
