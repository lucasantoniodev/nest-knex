import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import {
  IActionProps,
  IActionWithContitionsJoinableProps,
  IActionWithContitionsProps,
} from './knex.interface';

@Injectable()
export class KnexNewRepository implements OnModuleDestroy {
  public constructor(@InjectKnex() private readonly knex: Knex) {}

  public onModuleDestroy() {
    if (this.knex) {
      this.knex.destroy();
    }
  }

  public get client() {
    return this.knex;
  }

  public async executeTransaction<T>(
    callback: (trx: Knex.Transaction) => Promise<T>,
  ) {
    let result: T;
    const trx = await this.client.transaction();
    try {
      result = await callback(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
    return result;
  }

  public async create<T>({
    trx,
    tableName,
    entity,
  }: IActionProps<T>): Promise<T> {
    const [records] = await trx.table(tableName).insert(entity).returning('*');
    return records;
  }

  public async findById<T>({
    trx,
    tableName,
    columnNameId,
    id,
    conditions = {},
  }: IActionWithContitionsProps<T>) {
    return trx
      .table(tableName)
      .select('*')
      .where(columnNameId ?? 'id', id)
      .where(conditions)
      .first();
  }

  public async findByIdWithJoin<T>({
    trx,
    tableName,
    columnNameId = 'id',
    id,
    conditions = {},
    joinTableName = '',
    joinColumnName = 'id',
  }: IActionWithContitionsJoinableProps<T>) {
    return await trx
      .table(tableName)
      .select(`${tableName}.*`, `${joinTableName}.*`)
      .leftJoin(
        joinTableName,
        `${tableName}.${columnNameId}`,
        '=',
        `${joinTableName}.${joinColumnName}`,
      )
      .where(`${tableName}.${columnNameId}`, id)
      .where(conditions)
      .first();
  }

  public async update<T>({
    trx,
    tableName,
    columnNameId,
    id,
    entity,
    conditions = {},
  }: IActionWithContitionsProps<T>): Promise<T> {
    if (!this.hasProperty<T>(entity)) {
      return await this.findById<T>({
        trx,
        tableName,
        columnNameId: columnNameId ?? 'id',
        id,
      });
    }

    const [records] = await trx
      .table(tableName)
      .update(entity)
      .where(columnNameId ?? 'id', id)
      .where(conditions)
      .returning('*');
    return records;
  }

  private hasProperty<T>(entity: T) {
    return Object.values(entity).some((value) => value !== undefined);
  }
}
