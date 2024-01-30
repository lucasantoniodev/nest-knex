export interface CollectionItemModel {
  id?: string;
  type: number;
  code: number;
  organizational_resource_plant_id: string;
  title: string;
  description: string;
  file_path?: string;
  expiry_date: Date;
  version?: number;
  created_at?: Date;
  updated_at?: Date;
}
