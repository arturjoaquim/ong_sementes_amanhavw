export interface PersonDocumentDTO {
  id: number;
  documentTypeId: number;
  number: string;
  extraData?: { [key: string]: any };
  active?: boolean | null;
}
