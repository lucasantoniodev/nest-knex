export interface TextItemHistory {
  id?: string;
  user: string;
  text_item_id?: string;
  collection_item_id?: string;
  min_length?: number;
  max_length: number;
  validate_min_length: boolean;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath: string;
  expiry_date: Date;
  version?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  revision_history_id?: string;
}
