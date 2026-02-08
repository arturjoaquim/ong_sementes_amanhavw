import { IndividualPerson } from '../../../shared/types/person.type';
import { PersonDataDTO } from '../types/dtos/student-details.dto';
import { IndividualPersonDTO } from '../types/dtos/individual-person.dto';

export class PersonConverter {
  static toModel(dto: PersonDataDTO): IndividualPerson {
    return {
      id: 0,
      personTypeId: null,
      personName: dto.personName,
      birthDate: new Date(dto.birthDate),
      sexId: dto.sexId,
      fatherName: dto.fatherName,
      motherName: dto.motherName,
      raceId: dto.raceId,
      naturalnessId: dto.naturalnessId,
      address: dto.address ? {
        id: 0,
        street: dto.address.street,
        streetNumber: dto.address.streetNumber,
        complement: dto.address.complement,
        neighborhood: dto.address.neighborhood,
        city: dto.address.city,
        uf: dto.address.uf,
        cep: dto.address.cep
      } : undefined,
      contact: dto.contact ? {
        id: 0,
        email: dto.contact.email,
        telephone: dto.contact.telephone,
        mobilePhone: dto.contact.mobilePhone,
        hasWhatsApp: dto.contact.hasWhatsApp
      } : undefined,
      documents: dto.documents ? dto.documents.map(d => ({
        id: 0,
        documentTypeId: d.documentTypeId,
        number: d.number,
        active: d.active,
        documentDetail: d.extraData || null
      })) : [],
      education: dto.education ? {
        id: 0,
        institution: dto.education.institution,
        educationLevelId: dto.education.educationLevelId,
        periodId: dto.education.periodId,
        educationStatusId: dto.education.educationStatusId
      } : undefined
    };
  }

  static toDTO(person: IndividualPerson): IndividualPersonDTO {
    return {
      personName: person.personName,
      birthDate: person.birthDate,
      motherName: person.motherName,
      fatherName: person.fatherName,
      naturalnessId: person.naturalnessId,
      raceId: person.raceId,
      sexId: person.sexId,
      address: person.address ? {
        cep: person.address.cep,
        streetNumber: person.address.streetNumber,
        street: person.address.street,
        neighborhood: person.address.neighborhood,
        city: person.address.city,
        uf: person.address.uf,
        complement: person.address.complement
      } : null as any,
      contact: person.contact ? {
        telephone: person.contact.telephone,
        mobilePhone: person.contact.mobilePhone,
        hasWhatsApp: person.contact.hasWhatsApp,
        email: person.contact.email
      } : null as any,
      education: person.education ? {
        institution: person.education.institution,
        periodId: person.education.periodId,
        educationLevelId: person.education.educationLevelId,
        educationStatusId: person.education.educationStatusId
      } : null as any,
      documents: person.documents ? person.documents.map(d => ({
        documentTypeId: d.documentTypeId,
        number: d.number,
        extraData: d.documentDetail || undefined
      })) : []
    };
  }
}
