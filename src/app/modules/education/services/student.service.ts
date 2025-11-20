import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../types/student.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudentPreviewData } from '../types/preview-student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/students'; // Exemplo de URL da sua API

  /**
   * Busca um estudante específico pelo ID.
   * Retorna um Observable que emite o estudante encontrado.
   */
  getStudentById(id: number): Observable<Student> {
    return of(initialStudents.filter((student) => student.id === id)[0]);
    //return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo estudante no backend.
   * Retorna um Observable que emite o estudante criado.
   */
  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  /**
   * Atualiza um estudante existente no backend.
   * Retorna um Observable que emite o estudante atualizado.
   */
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
  }

  /**
   * Deleta um estudante do backend.
   * Retorna um Observable que completa quando a operação termina.
   */
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca estudantes no backend com base em filtros, paginação e ordenação.
   * Cada chamada a este método dispara uma nova requisição HTTP.
   * @param filters Objeto com os filtros a serem aplicados.
   * @returns Um Observable que emite um array de estudantes.
   */
  searchStudents(filters: any = {}): Observable<Student[]> {
    let params = new HttpParams();

    // Constrói os query params para a API a partir do objeto de filtros
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<Student[]>(this.apiUrl, { params });
  }
}

export const initialStudents: Student[] = [
  {
    id: 1,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    periodId: 1,
    personData: {
      personId: 1,
      personTypeId: 1,
      name: 'Ahmed Khan',
      birthDate: new Date('2010-05-15'),
      sexId: 1, // Masculino
      raceId: 2, // Parda
      naturalnessId: 1, // São Paulo, SP
      fatherName: 'Hassan Khan',
      motherName: 'Fatima Khan',
      personAddress: {
        personId: 1,
        street: 'Rua Exemplo',
        number: '123',
        complement: 'Apto 4',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
      },
      personContact: [],
      personDocument: [
        {
          personId: 1,
          documentTypeId: 1, // CPF
          documentNumber: '123.456.789-00',
          documentData: {},
        },
        {
          personId: 1,
          documentTypeId: 4, // NIS
          documentNumber: '12345678901',
          documentData: {},
        },
        {
          personId: 1,
          documentTypeId: 2, // RG
          documentNumber: '11.222.333-4',
          documentData: {},
        },
        {
          personId: 1,
          documentTypeId: 3, // Certidão de Nascimento
          documentNumber: '123456 01 55 2010 1 00123 123 0045678-01',
          documentData: {
            book: 'A-123',
            page: '123',
            issueDate: new Date('2010-05-20'),
            registry: 'Cartório de Registro Civil de São Paulo',
            registryCode: 'SP-CRC-001',
          },
        },
      ],
      personEducation: {
        personId: 1,
        institutionName: 'Escola Modelo',
        studyLevelId: 1,
        academicPeriodId: 1,
        educationStatusId: 1,
      },
    },
    enrollmentDate: new Date('2023-09-01'),
    status: 'active',
    attendance: 94,
    enrollmentOrigin: 'community',
    accompaniedStatus: true,
    transportGuardianName: 'Fatima Khan',
    emergencyContact: {
      emergencyContactId: 1,
      studentId: 1,
      emergencyContactName: 'Fatima Khan',
      contactTypeId: 1, // Ex: 'phone'
      contactValue: '+1 (555) 123-4567',
    },
    notes: [],
    healthData: {
      studentHealthId: 1,
      studentId: 1,
      ubsName: 'UBS Jardim Paulistano',
      flagUseGlasses: 'Não',
      dataExpirationDate: new Date('2025-01-01'),
      medicalNotes: [
        {
          studentMedicalNoteId: 1,
          studentHealthId: 1,
          medicalNoteTypeId: 4, // Ex: 'Allergy'
          descriptionEmergencyProcedure: 'Administer EpiPen if signs of anaphylaxis.',
          summaryNote: 'Alergia a amendoim',
          description: 'Severe peanut allergy.',
          noteDate: new Date(),
          medicalLocationId: 1,
        },
      ],
      medicalTreatments: [
        {
          id: 1,
          studentHealthId: 1,
          medicalTreatmentTypeId: 3, // Fisioterapia
          description:
            'Sessões semanais de fisioterapia para fortalecimento muscular devido a uma lesão leve no joelho.',
        },
      ],
    },
    dwellingCondition: {
      id: 1,
      studentId: 1,
      parentsMaritalStatusId: 1, // Ex: 'married'
      hasSeparatedParentContact: false,
      staysHomeAlone: false,
      familyId: 1,
      family: {
        id: 1,
        typeDwellingId: 1, // Alugada
        crasName: 'CRAS Sé',
        familyEvaluation:
          'Família estável e solidária. Ambos os pais trabalham para sustentar a casa e incentivam o potencial acadêmico de Ahmed.',
        informationExpirationDate: new Date('2025-01-01'),
        dwellingVisits: [
          {
            id: 1,
            date: new Date('2023-10-15'),
            summary: 'Visita inicial de avaliação',
            description:
              'Visita realizada para conhecer a dinâmica familiar e as condições de moradia.',
            creatorUserId: 1,
            familyId: 1,
          },
        ],
        familyMembers: [
          {
            id: 'FM-001',
            name: 'Hassan Khan',
            relationship: 'Pai',
            profession: 'Motorista de aplicativo',
            income: '1800.00',
            kinshipDegreeId: 2,
            familyId: 1,
          },
        ],
        familyBenefits: [
          { id: 1, benefitTypeId: 1, familyId: 1 }, // Bolsa Família
        ],
        familySocialRisks: [],
      },
    },
    socialInteractions: [],
    guardianRelashionship: [
      {
        idRelashionship: 1,
        idStudent: 1,
        idGuardian: 1,
        guardian: {
          id: 1,
          kinshipDegreeId: 1, // 'Mãe'
          peopleData: {
            personId: 101,
            personTypeId: 2,
            name: 'Fatima Khan',
            birthDate: new Date('1980-02-20'),
            sexId: 2, // Feminino
            raceId: 2, // Parda
            naturalnessId: 1,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 101,
              street: 'Rua Exemplo',
              number: '123',
              complement: 'Apto 4',
              neighborhood: 'Centro',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01000-000',
            },
            personContact: [
              {
                personId: 101,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 123-4567',
              },
              {
                personId: 101,
                contactTypeId: 2, // Email
                contactValue: 'fatima.khan@email.com',
              },
            ],
            personDocument: [
              {
                personId: 101,
                documentTypeId: 1, // CPF
                documentNumber: '111.222.333-44',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
      {
        idRelashionship: 4, // Novo ID
        idStudent: 1,
        idGuardian: 4, // Novo ID
        guardian: {
          id: 4,
          kinshipDegreeId: 2, // 'Pai'
          peopleData: {
            personId: 104,
            personTypeId: 2,
            name: 'Hassan Khan',
            birthDate: new Date('1978-11-15'),
            sexId: 1, // Masculino
            raceId: 2, // Parda
            naturalnessId: 1,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 104,
              street: 'Rua Exemplo',
              number: '123',
              complement: 'Apto 4',
              neighborhood: 'Centro',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01000-000',
            },
            personContact: [
              {
                personId: 104,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 987-6543',
              },
              {
                personId: 104,
                contactTypeId: 2, // Email
                contactValue: 'hassan.khan@email.com',
              },
            ],
            personDocument: [
              {
                personId: 104,
                documentTypeId: 1, // CPF
                documentNumber: '444.555.666-77',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
    ],
    socialActivities: [
      {
        id: 1,
        name: 'Futebol',
        socialActivityTypeId: 1, // Ex: 'sports'
        description: 'Treino de futebol no centro comunitário.',
      },
    ],
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    periodId: 1,
    personData: {
      personId: 2,
      personTypeId: 1,
      name: 'Maria Santos',
      birthDate: new Date('2012-03-22'),
      sexId: 2, // Feminino
      raceId: 2, // Parda
      naturalnessId: 2, // Salvador, BA
      fatherName: 'Carlos Santos',
      motherName: 'Ana Santos',
      personAddress: {
        personId: 2,
        street: 'Avenida Teste',
        number: '456',
        complement: '',
        neighborhood: 'Bairro Novo',
        city: 'Salvador',
        state: 'BA',
        zipCode: '40000-000',
      },
      personContact: [],
      personDocument: [
        {
          personId: 2,
          documentTypeId: 1, // CPF
          documentNumber: '234.567.890-11',
          documentData: {},
        },
        {
          personId: 2,
          documentTypeId: 4, // NIS
          documentNumber: '23456789012',
          documentData: {},
        },
        {
          personId: 2,
          documentTypeId: 2, // RG
          documentNumber: '22.333.444-5',
          documentData: {},
        },
        {
          personId: 2,
          documentTypeId: 3, // Certidão de Nascimento
          documentNumber: '234567 01 55 2012 1 00234 234 0056789-02',
          documentData: {
            book: 'B-234',
            page: '234',
            issueDate: new Date('2012-03-28'),
            registry: 'Cartório de Registro Civil de Salvador',
            registryCode: 'BA-CRC-002',
          },
        },
      ],
      personEducation: {} as any,
    },
    enrollmentDate: new Date('2022-09-01'),
    status: 'active',
    attendance: 88,
    enrollmentOrigin: 'school',
    emergencyContact: {
      emergencyContactId: 2,
      studentId: 2,
      emergencyContactName: 'Carlos Santos',
      contactTypeId: 1,
      contactValue: '+1 (555) 234-5678',
    },
    notes: [],
    healthData: {
      studentHealthId: 2,
      studentId: 2,
      ubsName: 'UBS Itapuã',
      flagUseGlasses: 'Sim',
      dataExpirationDate: new Date('2025-01-01'),
      medicalNotes: [
        {
          studentMedicalNoteId: 2,
          studentHealthId: 2,
          medicalNoteTypeId: 1, // Restrição Alimentar
          descriptionEmergencyProcedure: 'Nenhum procedimento de emergência específico.',
          summaryNote: 'Intolerância à lactose',
          description: 'Apresenta desconforto gástrico ao consumir laticínios.',
          noteDate: new Date('2023-05-10'),
          medicalLocationId: 2,
        },
      ],
      medicalTreatments: [
        {
          id: 2,
          studentHealthId: 2,
          medicalTreatmentTypeId: 1, // Oftalmológico
          description: 'Acompanhamento anual com oftalmologista para ajuste de grau.',
        },
      ],
    },
    dwellingCondition: {
      id: 2,
      studentId: 2,
      parentsMaritalStatusId: 1,
      hasSeparatedParentContact: false,
      staysHomeAlone: false,
      familyId: 2,
      family: {
        id: 2,
        typeDwellingId: 2, // Própria
        crasName: 'CRAS Itapuã',
        familyEvaluation: 'Ambiente familiar positivo, com bom suporte para a estudante.',
        informationExpirationDate: new Date('2025-01-01'),
        dwellingVisits: [],
        familyMembers: [
          {
            id: 'FM-002',
            name: 'Ana Santos',
            relationship: 'Mãe',
            profession: 'Artesã',
            income: '950.00',
            kinshipDegreeId: 1,
            familyId: 2,
          },
        ],
        familyBenefits: [],
        familySocialRisks: [],
      },
    },
    socialInteractions: [],
    guardianRelashionship: [
      {
        idRelashionship: 2,
        idStudent: 2,
        idGuardian: 2,
        guardian: {
          id: 2,
          kinshipDegreeId: 2, // 'Pai'
          peopleData: {
            personId: 102,
            personTypeId: 2,
            name: 'Carlos Santos',
            birthDate: new Date('1978-11-10'),
            sexId: 1, // Masculino
            raceId: 2, // Parda
            naturalnessId: 2,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 102,
              street: 'Avenida Teste',
              number: '456',
              complement: '',
              neighborhood: 'Bairro Novo',
              city: 'Salvador',
              state: 'BA',
              zipCode: '40000-000',
            },
            personContact: [
              {
                personId: 102,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 234-5678',
              },
              {
                personId: 102,
                contactTypeId: 2, // Email
                contactValue: 'carlos.santos@email.com',
              },
            ],
            personDocument: [
              {
                personId: 102,
                documentTypeId: 1, // CPF
                documentNumber: '222.333.444-55',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
      {
        idRelashionship: 5, // Novo ID
        idStudent: 2,
        idGuardian: 5, // Novo ID
        guardian: {
          id: 5,
          kinshipDegreeId: 1, // 'Mãe'
          peopleData: {
            personId: 105,
            personTypeId: 2,
            name: 'Ana Santos',
            birthDate: new Date('1981-01-25'),
            sexId: 2, // Feminino
            raceId: 2, // Parda
            naturalnessId: 2,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 105,
              street: 'Avenida Teste',
              number: '456',
              complement: '',
              neighborhood: 'Bairro Novo',
              city: 'Salvador',
              state: 'BA',
              zipCode: '40000-000',
            },
            personContact: [
              {
                personId: 105,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 876-5432',
              },
              {
                personId: 105,
                contactTypeId: 2, // Email
                contactValue: 'ana.santos@email.com',
              },
            ],
            personDocument: [
              {
                personId: 105,
                documentTypeId: 1, // CPF
                documentNumber: '555.666.777-88',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
    ],
    socialActivities: [],
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    periodId: 1,
    personData: {
      personId: 3,
      personTypeId: 1,
      name: 'David Chen',
      birthDate: new Date('2009-08-10'),
      sexId: 1, // Masculino
      raceId: 3, // Amarela
      naturalnessId: 3, // Curitiba, PR
      fatherName: 'Robert Chen',
      motherName: 'Linda Chen',
      personAddress: {
        personId: 3,
        street: 'Rua Inovação',
        number: '789',
        complement: '',
        neighborhood: 'Tecnoparque',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80000-000',
      },
      personContact: [],
      personDocument: [
        {
          personId: 3,
          documentTypeId: 1, // CPF
          documentNumber: '345.678.901-22',
          documentData: {},
        },
        {
          personId: 3,
          documentTypeId: 4, // NIS
          documentNumber: '34567890123',
          documentData: {},
        },
        {
          personId: 3,
          documentTypeId: 2, // RG
          documentNumber: '33.444.555-6',
          documentData: {},
        },
        {
          personId: 3,
          documentTypeId: 3, // Certidão de Nascimento
          documentNumber: '345678 01 55 2009 1 00345 345 0067890-03',
          documentData: {
            book: 'C-345',
            page: '345',
            issueDate: new Date('2009-08-15'),
            registry: 'Cartório de Registro Civil de Curitiba',
            registryCode: 'PR-CRC-003',
          },
        },
      ],
      personEducation: {} as any,
    },
    enrollmentDate: new Date('2024-01-15'),
    status: 'active',
    attendance: 96,
    enrollmentOrigin: 'community',
    emergencyContact: {
      emergencyContactId: 3,
      studentId: 3,
      emergencyContactName: 'Linda Chen',
      contactTypeId: 1,
      contactValue: '+1 (555) 345-6789',
    },
    notes: [],
    healthData: {
      studentHealthId: 3,
      studentId: 3,
      ubsName: 'UBS Santa Felicidade',
      flagUseGlasses: 'Não',
      dataExpirationDate: new Date('2025-01-01'),
      medicalNotes: [
        {
          studentMedicalNoteId: 3,
          studentHealthId: 3,
          medicalNoteTypeId: 2, // Doença Crônica
          descriptionEmergencyProcedure: 'Utilizar bombinha de Salbutamol em caso de crise.',
          summaryNote: 'Asma leve',
          description: 'Asma controlada, com crises esporádicas induzidas por esforço físico.',
          noteDate: new Date('2022-11-20'),
          medicalLocationId: 3,
        },
      ],
      medicalTreatments: [
        {
          id: 3,
          studentHealthId: 3,
          medicalTreatmentTypeId: 2, // Odontológico
          description: 'Manutenção de aparelho ortodôntico a cada 3 meses.',
        },
      ],
    },
    dwellingCondition: {
      id: 3,
      studentId: 3,
      parentsMaritalStatusId: 2,
      hasSeparatedParentContact: false,
      staysHomeAlone: false,
      familyId: 3,
      family: {
        id: 3,
        typeDwellingId: 2, // Própria
        crasName: 'CRAS Santa Felicidade',
        familyEvaluation: 'Família com boa estrutura e forte ênfase na educação.',
        informationExpirationDate: new Date('2025-01-01'),
        dwellingVisits: [],
        familyMembers: [],
        familyBenefits: [],
        familySocialRisks: [
          {
            id: 1,
            typeSocialRiskId: 1, // Ex: Vulnerabilidade
            prioritySituation: false,
            description: 'Risco social baixo, família bem estruturada.',
            familyId: 3,
          },
        ],
      },
    },
    socialInteractions: [],
    guardianRelashionship: [
      {
        idRelashionship: 3,
        idStudent: 3,
        idGuardian: 3,
        guardian: {
          id: 3,
          kinshipDegreeId: 1, // 'Mãe'
          peopleData: {
            personId: 103,
            personTypeId: 2,
            name: 'Linda Chen',
            birthDate: new Date('1982-07-30'),
            sexId: 2, // Feminino
            raceId: 3, // Amarela
            naturalnessId: 3,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 103,
              street: 'Rua Inovação',
              number: '789',
              complement: '',
              neighborhood: 'Tecnoparque',
              city: 'Curitiba',
              state: 'PR',
              zipCode: '80000-000',
            },
            personContact: [
              {
                personId: 103,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 345-6789',
              },
              {
                personId: 103,
                contactTypeId: 2, // Email
                contactValue: 'linda.chen@email.com',
              },
            ],
            personDocument: [
              {
                personId: 103,
                documentTypeId: 1, // CPF
                documentNumber: '333.444.555-66',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
      {
        idRelashionship: 6, // Novo ID
        idStudent: 3,
        idGuardian: 6, // Novo ID
        guardian: {
          id: 6,
          kinshipDegreeId: 2, // 'Pai'
          peopleData: {
            personId: 106,
            personTypeId: 2,
            name: 'Robert Chen',
            birthDate: new Date('1980-06-10'),
            sexId: 1, // Masculino
            raceId: 3, // Amarela
            naturalnessId: 3,
            fatherName: '',
            motherName: '',
            personAddress: {
              personId: 106,
              street: 'Rua Inovação',
              number: '789',
              complement: '',
              neighborhood: 'Tecnoparque',
              city: 'Curitiba',
              state: 'PR',
              zipCode: '80000-000',
            },
            personContact: [
              {
                personId: 106,
                contactTypeId: 1, // Celular
                contactValue: '+1 (555) 765-4321',
              },
              {
                personId: 106,
                contactTypeId: 2, // Email
                contactValue: 'robert.chen@email.com',
              },
            ],
            personDocument: [
              {
                personId: 106,
                documentTypeId: 1, // CPF
                documentNumber: '666.777.888-99',
                documentData: {},
              },
            ],
            personEducation: {} as any,
          },
        },
      },
    ],
    socialActivities: [],
  },
];

export const previewStudents: StudentPreviewData[] = initialStudents.map((student) => {
  // A interface StudentPreviewData espera um 'id' numérico.
  // Como o 'id' em initialStudents é uma string (ex: 'STU-001'),
  // usamos o índice do array + 1 como um ID numérico simples.
  // O ideal seria que a API ou a fonte de dados fornecesse um ID numérico único.
  return {
    id: student.id,
    name: student.personData.name,
    avatar: student.avatar,
    // A idade precisa ser calculada a partir da data de nascimento
    age: new Date().getFullYear() - student.personData.birthDate.getFullYear(),
    grade: 'Não definido', // Este campo não existe na interface Student
    guardian: student.emergencyContact.emergencyContactName,
    guardianPhone: student.emergencyContact.contactValue,
    status: student.status,
    attendance: student.attendance,
  } as StudentPreviewData;
});
