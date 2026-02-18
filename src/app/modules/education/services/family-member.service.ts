import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class FamilyMemberService {
  private http = inject(HttpClient);
  private apiUrl = `${environment}/families`;

  addMember(familyId: number, memberData: any): Observable<void> {
    const dto = {
        name: memberData.name,
        profession: memberData.profession,
        monthlyIncome: memberData.income,
        kinshipId: memberData.kinshipDegreeId
    };
    return this.http.post<void>(`${this.apiUrl}/${familyId}/members`, dto);
  }

  updateMember(familyId: number, memberId: number, memberData: any): Observable<void> {
    const dto = {
        name: memberData.name,
        profession: memberData.profession,
        monthlyIncome: memberData.income,
        kinshipId: memberData.kinshipDegreeId
    };
    return this.http.patch<void>(`${this.apiUrl}/${familyId}/members/${memberId}`, dto);
  }

  removeMember(familyId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${familyId}/members/${memberId}`);
  }
}
