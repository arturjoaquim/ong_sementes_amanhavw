import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonDocumentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/people';

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
