import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EmployeeDetailComponent } from './employee-detail.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { EmployeeResponseDTO } from '../../types/dtos/employee-response.dto';

describe('EmployeeDetailComponent', () => {
  let component: EmployeeDetailComponent;
  let fixture: ComponentFixture<EmployeeDetailComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockDialog: jasmine.SpyObj<Dialog>;

  const dummyEmployee: EmployeeResponseDTO = {
    id: 5,
    positionId: 1,
    systemUserId: 2,
    person: {
      id: 50,
      personName: 'Mariana Souza',
      birthDate: new Date('1990-01-01'),
      motherName: 'Ana Souza',
      fatherName: 'José Souza',
      naturalnessId: 1,
      raceId: 1,
      sexId: 2,
      education: {
        educationLevelId: 4,
        institution: 'Universidade',
        periodId: 1,
        educationStatusId: 1,
      },
      address: {
        street: 'Rua das Flores',
        streetNumber: '123',
        complement: 'Apto 1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        uf: 'SP',
        cep: '01001-000',
      },
      contact: {
        email: 'mariana@email.com',
        telephone: '1133334444',
        mobilePhone: '11999998888',
        hasWhatsApp: true,
      },
      documents: [],
    },
  };

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployeeById', 'updateEmployee']);
    mockEmployeeService.getEmployeeById.and.returnValue(of(dummyEmployee));
    mockDialog = jasmine.createSpyObj('Dialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [EmployeeDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '5' : null),
              },
            },
          },
        },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Dialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados do funcionário da rota', () => {
    expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(5);
    expect(component.employee()?.person.personName).toBe('Mariana Souza');
    expect(component.fullAddress).toContain('Rua das Flores, 123');
  });
});
