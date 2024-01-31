export interface ItemForm {
  id?: string;
  type: string;
  collection_form_id: string;
  collection_item_id: string;
}

export interface CollectionFormModel {
  id?: string;
  name?: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}
