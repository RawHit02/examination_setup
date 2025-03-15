export interface ITable {
  id: string;
  createdDate: Date;
  updatedBy?: string;
  updatedDate?: Date;
  isDeleted: boolean;
}
