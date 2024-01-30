export interface CollectionFormRevisionModel {
  id?: string;
  name?: string;
  description: string;
  collection_form_id: string;
  version?: number;
  created_at: Date;
  updated_at: Date;
}
