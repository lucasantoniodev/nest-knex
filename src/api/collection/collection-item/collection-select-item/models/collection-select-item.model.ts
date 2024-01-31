export interface SelectItemModel {
  id?: string;
  collection_item_id: string;
}

export interface SelectItemModelHistoryModel {
  id?: string;
  select_item_id: string;
  collection_item_id: string;
  type: number;
  code: number;
  organizational_resource_plant_id: string;
  title: string;
  description: string;
  filePath: string;
  expiry_date: Date;
  version: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  revision_history_id: string;
}

export interface SelectOptionModel {
  id?: string;
  select_item_id: string;
  description: string;
  index: number;
  approves: boolean;
  version: number;
}

export interface SelectOptionHistoryModel {
  id?: string;
  select_item_id: string;
  select_option_id: string;
  description: string;
  index: number;
  approves: boolean;
  version: number;
  revision_history_id?: string;
}
