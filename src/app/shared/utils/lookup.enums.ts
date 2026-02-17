export const DwellingType = {
  ALUGADA: { id: 1, descricao: 'Alugada' },
  PROPRIA: { id: 2, descricao: 'Própria' },
  CEDIDA: { id: 3, descricao: 'Cedida' },
} as const;
export type DwellingType = (typeof DwellingType)[keyof typeof DwellingType];

export const MaritalStatus = {
  CASADOS: { id: 1, descricao: 'Casados' },
  SEPARADOS: { id: 2, descricao: 'Separados' },
  DIVORCIADOS: { id: 3, descricao: 'Divorciados' },
  VIUVO: { id: 4, descricao: 'Viúvo(a)' },
} as const;
export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

export const KinshipDegree = {
  MAE: { id: 1, descricao: 'Mãe' },
  PAI: { id: 2, descricao: 'Pai' },
  IRMAO: { id: 3, descricao: 'Irmão/Irmã' },
  AVO: { id: 4, descricao: 'Avó/Avô' },
} as const;
export type KinshipDegree = (typeof KinshipDegree)[keyof typeof KinshipDegree];

export const Period = {
  MANHA: { id: 1, descricao: 'Manhã' },
  TARDE: { id: 2, descricao: 'Tarde' },
} as const;
export type Period = (typeof Period)[keyof typeof Period];

export const MedicalNoteType = {
  RESTRICAO_ALIMENTAR: {
    id: 1,
    descricao: 'Restrição Alimentar',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  DOENCA_CRONICA: {
    id: 2,
    descricao: 'Doença Crônica',
    badgeColor: 'bg-red-100 text-red-700',
  },
  RESTRICAO_ATIVIDADE_FISICA: {
    id: 3,
    descricao: 'Restrição Atividade Física',
    badgeColor: 'bg-yellow-100 text-yellow-700',
  },
  ALERGIA: { id: 4, descricao: 'Alergia', badgeColor: 'bg-red-100 text-red-700' },
  DEFICIENCIA: { id: 5, descricao: 'Deficiência', badgeColor: 'bg-blue-100 text-blue-700' },
} as const;
export type MedicalNoteType = (typeof MedicalNoteType)[keyof typeof MedicalNoteType];

export const MedicalTreatmentType = {
  OFTALMOLOGICO: { id: 1, descricao: 'Oftalmológico' },
  ODONTOLOGICO: { id: 2, descricao: 'Odontológico' },
  FISIOTERAPIA: { id: 3, descricao: 'Fisioterapia' },
} as const;
export type MedicalTreatmentType = (typeof MedicalTreatmentType)[keyof typeof MedicalTreatmentType];

export const MedicalLocation = {
  UBS: { id: 1, descricao: 'UBS' },
  HOSPITAL_GERAL: { id: 2, descricao: 'Hospital Geral' },
  CAPS: { id: 3, descricao: 'CAPS' },
  SER: { id: 4, descricao: 'SER' },
} as const;
export type MedicalLocation = (typeof MedicalLocation)[keyof typeof MedicalLocation];

export const Sex = {
  MASCULINO: { id: 1, descricao: 'Masculino' },
  FEMININO: { id: 2, descricao: 'Feminino' },
} as const;
export type Sex = (typeof Sex)[keyof typeof Sex];

export const EnrollmentOrigin = {
  CONSELHO_TUTELAR: { id: 1, descricao: 'Conselho Tutelar' },
  CRAS_CREAS: { id: 2, descricao: 'CRAS/CREAS' },
  DEMANDA_ESPONTANEA: { id: 3, descricao: 'Demanda Espontânea' },
  INTERNET: { id: 4, descricao: 'Internet' },
  TV: { id: 5, descricao: 'TV' },
  OUTROS: { id: 6, descricao: 'Outros' },
};
export type EnrollmentOrigin = (typeof EnrollmentOrigin)[keyof typeof EnrollmentOrigin];

export const SocialGroup = {
  FAMILIA: { id: 1, descricao: 'Família' },
  ESCOLA: { id: 2, descricao: 'Escola' },
  COMUNIDADE: { id: 3, descricao: 'Comunidade' },
} as const;
export type SocialGroup = (typeof SocialGroup)[keyof typeof SocialGroup];

export const InteractionLevel = {
  BOM: { id: 1, descricao: 'Bom' },
  REGULAR: { id: 2, descricao: 'Regular' },
  RUIM: { id: 3, descricao: 'Ruim' },
  NAO_OBSERVADO: { id: 4, descricao: 'Não Observado' },
} as const;
export type InteractionLevel = (typeof InteractionLevel)[keyof typeof InteractionLevel];

export const SocialActivityType = {
  ESPORTIVA: { id: 1, descricao: 'Esportiva' },
  CULTURAL: { id: 2, descricao: 'Cultural' },
  EDUCACIONAL: { id: 3, descricao: 'Educacional' },
} as const;
export type SocialActivityType = (typeof SocialActivityType)[keyof typeof SocialActivityType];

export const Place = {
  CASA: { id: 1, descricao: 'Casa' },
  RUA_BAIRRO: { id: 2, descricao: 'Rua do Bairro' },
  QUADRAS_PRACAS: { id: 3, descricao: 'Quadras/Praças/Parquinhos' },
  ESCOLA: { id: 4, descricao: 'Escola' },
  ONG: { id: 5, descricao: 'ONG' },
} as const;
export type Place = (typeof Place)[keyof typeof Place];

export const DocumentType = {
  CPF: { id: 1, descricao: 'CPF' },
  RG: { id: 2, descricao: 'RG' },
  CNH: { id: 3, descricao: 'CNH' },
  PASSAPORTE: { id: 4, descricao: 'Passaporte' },
  CERTIDAO_NASCIMENTO: { id: 5, descricao: 'Certidão de Nascimento' },
};
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const SchoolGrade = {
  FUNDAMENTAL_1_ANO: { id: 1, descricao: '1º Ano Fundamental' },
  FUNDAMENTAL_2_ANO: { id: 2, descricao: '2º Ano Fundamental' },
  FUNDAMENTAL_3_ANO: { id: 3, descricao: '3º Ano Fundamental' },
  FUNDAMENTAL_4_ANO: { id: 4, descricao: '4º Ano Fundamental' },
  FUNDAMENTAL_5_ANO: { id: 5, descricao: '5º Ano Fundamental' },
  FUNDAMENTAL_6_ANO: { id: 6, descricao: '6º Ano Fundamental' },
  FUNDAMENTAL_7_ANO: { id: 7, descricao: '7º Ano Fundamental' },
  FUNDAMENTAL_8_ANO: { id: 8, descricao: '8º Ano Fundamental' },
  FUNDAMENTAL_9_ANO: { id: 9, descricao: '9º Ano Fundamental' },
  MEDIO_1_ANO: { id: 10, descricao: '1º Ano Médio' },
  MEDIO_2_ANO: { id: 11, descricao: '2º Ano Médio' },
  MEDIO_3_ANO: { id: 12, descricao: '3º Ano Médio' },
};
export type SchoolGrade = (typeof SchoolGrade)[keyof typeof SchoolGrade];

export const EducationStatus = {
  CURSANDO: { id: 1, descricao: 'Cursando' },
  CONCLUIDO: { id: 2, descricao: 'Concluído' },
  INATIVO: { id: 3, descricao: 'Inativo' },
};
export type EducationStatus = (typeof EducationStatus)[keyof typeof EducationStatus];

export const RaceType = {
  BRANCA: { id: 1, descricao: 'Branca' },
  PRETA: { id: 2, descricao: 'Preta' },
  AMARELA: { id: 3, descricao: 'Amarela' },
  PARDA: { id: 4, descricao: 'Parda' },
  INDIGENA: { id: 5, descricao: 'Indígena' },
  NAO_INFORMADA: { id: 6, descricao: 'Não Informada' },
};
export type RaceType = (typeof RaceType)[keyof typeof RaceType];

export const NaturalnessType = {
  BRASILEIRA: { id: 1, descricao: 'Brasileiro' },
  ESTRANGEIRA: { id: 2, descricao: 'Estrangeiro' },
  NAO_INFORMADA: { id: 3, descricao: 'Não Informado' },
};
export type NaturalnessType = (typeof NaturalnessType)[keyof typeof NaturalnessType];

export const WorkshopType = {
  ARTES: { id: 1, descricao: 'Artes' },
  MUSICA: { id: 2, descricao: 'Música' },
  TEATRO: { id: 3, descricao: 'Teatro' },
  TECNOLOGIA: { id: 4, descricao: 'Tecnologia' },
  ESPORTES: { id: 5, descricao: 'Esportes' },
  LITERATURA: { id: 6, descricao: 'Literatura' },
  GASTRONOMIA: { id: 7, descricao: 'Gastronomia' },
} as const;
export type WorkshopType = (typeof WorkshopType)[keyof typeof WorkshopType];

export const PositionType = {
  COORDENADOR: { id: 1, name: 'Coordenador' },
  PROFESSOR: { id: 2, name: 'Professor' },
  ASSISTENTE_SOCIAL: { id: 3, name: 'Assistente Social' },
  PSICOLOGO: {id: 4, name:"Psicólogo"},
}
export type PositionType = (typeof PositionType)[keyof typeof  PositionType]

/**
 * Função auxiliar para criar um mapa a partir de um objeto "enum" para busca rápida por ID.
 * @param enumObject O objeto imutável que simula o enum.
 * @returns Um Record<number, T> para acesso rápido.
 */
function createLookupMap<T extends { id: number }>(
  enumObject: Record<string, T>,
): Record<number, T> {
  return Object.values(enumObject).reduce(
    (acc, current) => {
      acc[current.id] = current;
      return acc;
    },
    {} as Record<number, T>,
  );
}

export const MedicalNoteTypeMap = createLookupMap(MedicalNoteType);
export const MedicalTreatmentTypeMap = createLookupMap(MedicalTreatmentType);
export const MedicalLocationMap = createLookupMap(MedicalLocation);
export const PeriodMap = createLookupMap(Period);
export const SexMap = createLookupMap(Sex);
export const DwellingTypeMap = createLookupMap(DwellingType);
export const MaritalStatusMap = createLookupMap(MaritalStatus);
export const KinshipDegreeMap = createLookupMap(KinshipDegree);
export const SocialGroupMap = createLookupMap(SocialGroup);
export const InteractionLevelMap = createLookupMap(InteractionLevel);
export const PlaceMap = createLookupMap(Place);
export const SocialActivityTypeMap = createLookupMap(SocialActivityType);
export const DocumentTypeMap = createLookupMap(DocumentType);
export const SchoolGradeMap = createLookupMap(SchoolGrade);
export const EducationStatusMap = createLookupMap(EducationStatus);
export const RaceTypeMap = createLookupMap(RaceType);
export const NaturalnessTypeMap = createLookupMap(NaturalnessType);
export const EnrollmentOriginMap = createLookupMap(EnrollmentOrigin);
export const WorkshopTypeMap = createLookupMap(WorkshopType);

export const PositionTypeMap = createLookupMap(PositionType);
