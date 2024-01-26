export interface AuditProps {
  tableName?: string;
  tableNameHistory?: string;
  id?: string | number;
  data: any;
}

export interface DataConfig {
  oldName?: string;
  newName?: string;
}

export interface IActionInheritanceProps {
  baseData: AuditProps;
  childData: AuditProps;
  grandChildData?: AuditProps;
  referenceNameRelationId: string;
  referenceNameRelationGrandChildId?: string;
  tableNameHistory?: string;
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
