import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentDetailComponent } from './student-detail.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { of } from 'rxjs';
import { Student } from '../../types/student.type';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let mockStudentService: jasmine.SpyObj<StudentService>;

  const dummyStudent: Student = {
    id: 1,
    status: 'active',
    attendance: 95.5,
    avatar: '',
    enrollmentDate: new Date('2024-01-10'),
    periodId: 1,
    enrollmentOrigin: 'Comunidade',
    emergencyContact: {
      id: 1,
      email: 'maria@email.com',
      telephone: '11999998888',
      mobilePhone: '11999998888',
      hasWhatsApp: true,
    },
    notes: [],
    healthData: null,
    dwellingCondition: null,
    socialInteractions: [],
    guardianRelashionship: [],
    socialActivities: [],
    personData: {
      id: 10,
      personName: 'Carlos Silva',
      birthDate: new Date('2012-05-10'),
      sexId: 1,
      fatherName: 'João Silva',
      motherName: 'Maria Silva',
      raceId: 1,
      naturalnessId: 1,
      personTypeId: 1,
      documents: [],
      education: {
        id: 1,
        educationLevelId: 1,
        institution: 'Escola Municipal',
        periodId: 1,
        educationStatusId: 1,
      },
    },
  };

  beforeEach(async () => {
    mockStudentService = jasmine.createSpyObj('StudentService', ['getStudentDetailsById']);
    mockStudentService.getStudentDetailsById.and.returnValue(of(dummyStudent));

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
        { provide: StudentService, useValue: mockStudentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os detalhes do estudante a partir do ID da rota', () => {
    expect(mockStudentService.getStudentDetailsById).toHaveBeenCalledWith(1);
    expect(component.studentSignal()).toEqual(dummyStudent);
    expect(component.name).toBe('Carlos Silva');
  });

  it('deve alternar abas corretamente', () => {
    component.setActiveTab('health');
    expect(component.activeTab).toBe('health');
  });
});
