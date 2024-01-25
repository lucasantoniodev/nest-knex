export interface ConfigProps {
  tableName?: string;
  data?: any;
}

export interface DataConfig {
  oldName?: string;
  newName?: string;
}

export interface IActionForTwoTablesProps {
  firstData: ConfigProps;
  secondData: ConfigProps;
  referenceNameRelationId: string;
  config: {
    renameProps: boolean;
    firstDataConfig: DataConfig;
    secondDataConfig: DataConfig;
  };
}

export interface IFindByIdAndVersionProps {
  columnName?: string;
  id: string | number;
  version: number;
}

export interface IFindByIdProps {
  columnName?: string;
  id: string | number;
}
