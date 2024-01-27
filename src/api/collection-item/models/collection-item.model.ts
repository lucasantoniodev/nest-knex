export interface CollectionItemModel {
  id?: string;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath: string;
  expiry_date: Date;
  version?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
