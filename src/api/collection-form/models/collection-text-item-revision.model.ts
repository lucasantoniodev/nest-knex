export interface CollectionTextItemRevision {
  id?: string;
  type: number;
  code: number;
  organizational_resource_plant_id: string;
  title: string;
  description: string;
  filePath: string;
  expiry_date: Date;
  max_length: number;
  min_length?: number;
  validate_min_length: boolean;
  collection_item_id: string;
  collection_form_revision_id: string;
  created_at: Date;
  updated_at: Date;
}
