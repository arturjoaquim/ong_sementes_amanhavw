import { Student, StudentMedicalTreatment, StudentMedication } from '../types/student.type';
import { StudentDetailsDTO, StudentHealthResponseDTO, FamilyResponseDTO } from '../types/dtos/student-details.dto';
import { IndividualPerson } from '../../../shared/types/person.type';
import { StudentFamily } from '../types/student-family.type';
import { CreateStudentDTO } from '../types/dtos/create-student.dto';
import { UpdateStudentDTO } from '../types/dtos/update-student.dto';
import { PersonConverter } from './person.converter';
import { KinshipDegreeMap } from '../../../shared/utils/lookup.enums';
import { IndividualPersonDTO } from '../../../shared/types/dtos/individual-person.dto';

export class StudentConverter {
  static toModel(dto: StudentDetailsDTO): Student {
    return {
      id: dto.id,
      personData: PersonConverter.toModel(dto.personData),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.personData.personName}`,
      enrollmentDate: new Date(dto.enrollmentDate),
      status: dto.status,
      attendance: dto.attendance,
      periodId: dto.periodId,
      enrollmentOrigin: dto.registrationOriginId.toString(),
      accompaniedStatus: dto.accompaniedStatus,
      transportGuardianName: dto.transportGuardianName,
      emergencyContact: {
        id: 0,
        email: dto.emergencyContact.email,
        telephone: dto.emergencyContact.telephone,
        mobilePhone: dto.emergencyContact.mobilePhone,
        hasWhatsApp: dto.emergencyContact.hasWhatsApp
      },
      notes: dto.notes.map(n => ({
        id: n.id,
        studentId: dto.id,
        summary: n.summary,
        description: n.fullDescription,
        date: new Date(n.occurrenceDate),
        creatorId: 0
      })),
      healthData: dto.healthData ? this.mapHealthData(dto.healthData, dto.id) : null,
      dwellingCondition: dto.dwellingCondition ? {
        id: dto.dwellingCondition.id,
        studentId: dto.id,
        parentsMaritalStatusId: dto.dwellingCondition.parentsMaritalStatusId,
        hasSeparatedParentContact: dto.dwellingCondition.keepsContactWithSpouse,
        staysHomeAlone: dto.dwellingCondition.staysAloneAtHome,
        description: '',
        familyId: dto.dwellingCondition.family.id,
        family: this.mapFamilyData(dto.dwellingCondition.family)
      } : null,
      socialInteractions: dto.socialInteractions.map(s => ({
        id: s.id,
        interactionLevelId: s.interactionLevel,
        socialGroupId: 0,
        studentId: dto.id,
        socialInteractionPlace: []
      })),
      guardianRelashionship: dto.guardianRelashionship.map(g => ({
        studentId: dto.id,
        guardianId: g.id,
        kinshipId: g.kinshipId,
        guardian: {
          id: g.id,
          kinshipDegreeId: g.kinshipId,
          peopleData: this.mapGuardianPerson(g.person)
        }
      })),
      socialActivities: dto.socialActivities.map(s => ({
        id: s.id,
        name: '',
        socialActivityTypeId: 0,
        description: ''
      }))
    };
  }

  static toCreateDTO(student: Omit<Student, 'id'>): CreateStudentDTO {
    return {
      person: PersonConverter.toDTO(student.personData),
      studentData: {
        registrationOriginId: Number(student.enrollmentOrigin),
        periodId: student.periodId,
        hasTransportAutonomy: student.accompaniedStatus || false,
        transportResponsibleName: student.transportGuardianName || ''
      },
      guardians: student.guardianRelashionship.map(g => ({
        guardianId: g.guardianId,
        kinshipId: g.kinshipId
      })),
      registrationDate: student.enrollmentDate
    };
  }

  static toUpdateDTO(student: Student): UpdateStudentDTO {
    return {
      person: PersonConverter.toDTO(student.personData),
      studentData: {
        registrationOriginId: Number(student.enrollmentOrigin),
        periodId: student.periodId,
        hasTransportAutonomy: student.accompaniedStatus || false,
        transportResponsibleName: student.transportGuardianName || ''
      },
      active: student.status === 'active'
    };
  }

  private static mapGuardianPerson(dto: IndividualPersonDTO): IndividualPerson {
    return PersonConverter.toModel(dto);
  }

  private static mapHealthData(dto: StudentHealthResponseDTO, studentId: number) {
    const treatments: StudentMedicalTreatment[] = [];
    const medications: StudentMedication[] = [];

    dto.treatments.forEach(t => {
      treatments.push({
        id: t.id,
        treatmentDescription: t.treatmentDescription,
        observations: t.observations,
        monitoringLocationId: t.monitoringLocationId
      });
    });

    dto.medications.forEach(m => {
      medications.push({
        id: m.id,
        medicationName: m.medicationName,
        frequency: m.frequency,
        dosage: m.dosage
      });
    });

    return {
      id: dto.id,
      studentId: studentId,
      ubsReference: dto.ubsReference,
      wearsGlasses: dto.wearsGlasses,
      infoExpirationDate: new Date(dto.infoExpirationDate),
      medications: medications,
      treatments: treatments
    };
  }

  private static mapFamilyData(dto: FamilyResponseDTO): StudentFamily {
    return {
      id: dto.id,
      typeDwellingId: dto.domicileTypeId,
      crasName: dto.referenceCras,
      familyEvaluation: dto.familyAssessment,
      informationExpirationDate: new Date(dto.infoExpirationDate),
      dwellingVisits: dto.homeVisits.map(v => ({
        id: v.id,
        date: new Date(v.visitDate),
        summary: v.summary,
        description: v.fullReport,
        creatorUserId: v.visitorId,
        familyId: dto.id
      })),
      familyMembers: dto.members.map(m => ({
        id: m.id.toString(),
        name: m.name,
        relationship: KinshipDegreeMap[m.kinshipId]?.descricao || 'Não informado', // Mapeado
        profession: m.profession,
        income: m.monthlyIncome.toString(),
        kinshipDegreeId: m.kinshipId,
        familyId: dto.id
      })),
      familyBenefits: dto.benefits.map(b => ({
        id: 0,
        benefitTypeId: b.benefitId,
        familyId: dto.id
      })),
      familySocialRisks: dto.risks.map(r => ({
        id: r.id,
        typeSocialRiskId: 0,
        prioritySituation: r.isPriority,
        description: r.description,
        familyId: dto.id
      }))
    };
  }
}
