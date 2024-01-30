export interface ItemForm {
  id?: string;
  type: number;
  collection_form_id: string;
  collection_item_id: string;
}

export interface CollectionFormModel {
  id?: string;
  name?: string;
  description: string;
}
