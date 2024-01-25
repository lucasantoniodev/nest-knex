export interface CollectionItemModel {
  id?: string;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath?: string;
  expiry_date: Date;
  version?: number;
}

export interface TextItemModel {
  id?: string;
  collection_item_id?: string;
  min_length?: number;
  max_length: number;
  validate_min_length: boolean;
}

export interface CollectionTextItemHistoryModel {
  id: string;
  text_item_id: string;
  collection_item_id: string;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath?: string;
  expiry_date: Date;
  min_length?: number;
  max_length: number;
  validate_min_length: boolean;
  version: number;
}

export interface CreateCollectionTextItemRequestDto
  extends CollectionItemModel,
    TextItemModel {}

export interface CollectionTextItemUpdateRequestDto {
  id?: string;
  type?: number;
  code?: number;
  workcenter_id?: number;
  title?: string;
  description?: string;
  filePath?: string;
  expiry_date?: Date;
  version?: number;
  item?: {
    id?: string;
    collection_item_id?: string;
    min_length?: number;
    max_length?: number;
    validate_min_length?: boolean;
  };
}
