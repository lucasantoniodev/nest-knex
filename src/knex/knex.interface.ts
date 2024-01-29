import { Knex } from "knex";

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
