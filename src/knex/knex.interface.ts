export interface AuditProps {
  tableName?: string;
  data?: any;
}

export interface DataConfig {
  oldName?: string;
  newName?: string;
}

export interface IActionInheritanceProps {
  baseData: AuditProps;
  childData: AuditProps;
  referenceNameRelationId: string;
  config: {
    hasRename: boolean;
    baseDataConfig: DataConfig;
    childDataConfig: DataConfig;
  };
}

export interface IFindByIdAndVersionProps {
  columnName?: string;
  id: string | number;
  version: number;
}
