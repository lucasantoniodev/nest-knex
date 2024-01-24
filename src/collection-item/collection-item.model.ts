export interface CollectionTextItem {
  id?: string;
  type: number;
  code: number;
  workcenter_id: number;
  title: string;
  description: string;
  filePath: string;
  expiry_date: Date;
  version?: number;
  item: {
    id?: string;
    collection_item_id?: string;
    min_length?: number;
    max_length: number;
    validate_min_length: boolean;
  };
}
