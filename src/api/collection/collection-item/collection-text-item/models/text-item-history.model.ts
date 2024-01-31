export interface TextItemRevision {
  id?: string;
  type: number;
  code: number;
  organizational_resource_plant_id: string;
  title: string;
  description: string;
  file_path?: string;
  expiry_date: Date;
  min_length?: number;
  max_length: number;
  validate_min_length: boolean;
  collection_item_id: string;
  version: number;
  created_at: Date;
  updated_at: Date;
}