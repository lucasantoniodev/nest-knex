import { Knex } from 'knex';

export interface AuditProps {
  tableName?: string;
  tableNameHistory: string;
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
  config: {
    hasRename: boolean;
    baseDataConfig: DataConfig;
    childDataConfig: DataConfig;
    grandChildDataConfig?: DataConfig;
  };
}

export interface IFindByIdAndVersionProps {
  columnName?: string;
  id: string | number;
  data: Object;
  version: number;
}

//
export interface IActionProps<T> {
  trx?: Knex.Transaction;
  tableName: string;
  entity?: T;
}

export interface IActionWithContitionsProps<T> extends IActionProps<T> {
  columnNameId?: string;
  id: string | number;
  conditions?: Record<string, any>;
}

export interface IActionWithContitionsJoinableProps<T>
  extends IActionWithContitionsProps<T> {
  joinTableName: string;
  joinColumnName: string;
}
