import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { WorkshopDetailComponent } from './workshop-detail.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { WorkshopService } from '../../services/workshop.service';
import { StudentService } from '../../services/student.service';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { Workshop } from '../../types/workshop.type';

describe('WorkshopDetailComponent', () => {
  let component: WorkshopDetailComponent;
  let fixture: ComponentFixture<WorkshopDetailComponent>;
  let mockWorkshopService: jasmine.SpyObj<WorkshopService>;
  let mockStudentService: jasmine.SpyObj<StudentService>;
  let mockDialog: jasmine.SpyObj<Dialog>;

  const dummyWorkshop: Workshop = {
    id: 10,
    name: 'Oficina de Robótica',
    enrollmentLimit: 20,
    active: true,
    enrolledStudents: [],
    sessions: [],
  };

  beforeEach(async () => {
    mockWorkshopService = jasmine.createSpyObj('WorkshopService', ['getWorkshopById', 'updateWorkshop']);
    mockWorkshopService.getWorkshopById.and.returnValue(of(dummyWorkshop));

    mockStudentService = jasmine.createSpyObj('StudentService', ['searchStudentsPreview']);
    mockDialog = jasmine.createSpyObj('Dialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [WorkshopDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '10' : null),
              },
            },
          },
        },
        { provide: WorkshopService, useValue: mockWorkshopService },
        { provide: StudentService, useValue: mockStudentService },
        { provide: Dialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados da oficina da rota', () => {
    expect(mockWorkshopService.getWorkshopById).toHaveBeenCalledWith(10);
    expect(component.workshop()?.name).toBe('Oficina de Robótica');
  });
});
