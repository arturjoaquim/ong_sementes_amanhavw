import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FamilyMemberService } from './family-member.service';
import { environment } from '../../../../environments/environment';

describe('FamilyMemberService', () => {
  let service: FamilyMemberService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        FamilyMemberService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(FamilyMemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should use correct environment.apiUrl path for adding member', () => {
    const familyId = 12;
    const memberData = {
      name: 'Maria Silva',
      profession: 'Artesã',
      income: 1200,
      kinshipDegreeId: 1,
    };

    service.addMember(familyId, memberData).subscribe();

    const expectedUrl = `${environment.apiUrl}/families/${familyId}/members`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.url).not.toContain('[object Object]');
    expect(req.request.url).toBe(expectedUrl);
    req.flush({});
  });
});
