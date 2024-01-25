export interface ConfigProps {
  tableName?: string;
  data?: any;
}

export interface DataConfig {
  oldName?: string;
  newName?: string;
}

export interface IFindByIdAndVersionProps {
  columnName: string;
  id: string | number;
  version: number;
}
