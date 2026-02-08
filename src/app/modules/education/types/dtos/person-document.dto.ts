export interface PersonDocumentDTO {
  documentTypeId: number;
  number: string;
  extraData?: { [key: string]: any };
}
