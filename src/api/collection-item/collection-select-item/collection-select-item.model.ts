import { CollectionItemModel } from '../models/collection-item.model';

export interface CollectionSelectItemHistoryModel {
  id: string;
  select_item_id: string;
  collection_item_id: string;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath?: string;
  expiry_date: Date;
  version: number;
}

export interface CollectionSelectOption {
  id?: string;
  select_item_id: string;
  description: string;
  index: number;
  approves: boolean;
}

export interface CollectionSelectItemModel extends CollectionItemModel {
  options: CollectionSelectOption[];
}

export interface CollectionSelectItemUpdateRequestDto {
  id?: string;
  type?: number;
  code?: number;
  workcenter_id?: number;
  title?: string;
  description?: string;
  filePath?: string;
  expiry_date?: Date;
  version?: number;
  collection_item_id?: string;
  options: CollectionSelectOptionUpdateRequestDto[];
}

export interface CollectionSelectOptionUpdateRequestDto {
  id?: string;
  select_item_id?: string;
  description?: string;
  index?: number;
  approves?: boolean;
}
