import { CollectionItemModel } from 'src/api/collection-item/models/collection-item.model';
import { TextItemModel } from '../text-item.model';

export interface CreateTextItemModelDto
  extends CollectionItemModel,
    TextItemModel {}

export interface UpdateCollectionTextItemModelDto {
  type?: number;
  code?: number;
  workcenter_id?: number;
  title?: string;
  description?: string;
  filePath?: string;
  expiry_date?: Date;
  version?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  min_length?: number;
  max_length?: number;
  validate_min_length?: boolean;
}
