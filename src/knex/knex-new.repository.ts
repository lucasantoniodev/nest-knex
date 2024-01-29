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
    const records = await trx.table(tableName).insert(entity).returning('*');
    return Array.isArray(entity) ? (records as T) : (records[0] as T);
  }

  public async findAll<T>({ trx, tableName }: IActionProps<T>): Promise<T> {
    return (await trx.table(tableName).select('*').returning('*')) as T;
  }

  public async findById<T>({
    tableName,
    columnNameId = 'id',
    id,
    conditions = {},
  }: IActionWithContitionsProps<T>): Promise<T> {
    return this.client
      .table(tableName)
      .select('*')
      .where(columnNameId, id)
      .where(conditions)
      .first();
  }

  public async findByIdWithJoin<T>({
    tableName,
    columnNameId = 'id',
    id,
    conditions = {},
    joinTableName = '',
    joinColumnName = 'id',
  }: IActionWithContitionsJoinableProps<T>): Promise<T> {
    const [records] = await this.client
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
      .returning('*');
    return records;
  }

  public async update<T>({
    trx,
    tableName,
    columnNameId = 'id',
    id,
    entity,
    conditions = {},
  }: IActionWithContitionsProps<T>): Promise<T> {
    if (!this.hasProperty<T>(entity)) {
      return await this.findById<T>({
        trx,
        tableName,
        columnNameId,
        id,
      });
    }

    const [records] = await trx
      .table(tableName)
      .update(entity)
      .where(columnNameId, id)
      .where(conditions)
      .returning('*');
    return records;
  }

  public async delete<T>({
    trx,
    tableName,
    columnNameId = 'id',
    id,
    entity,
    conditions = {},
  }: IActionWithContitionsProps<T>): Promise<T> {
    if (entity) {
      await this.update({
        trx,
        tableName,
        columnNameId,
        id,
        entity,
      });
    }

    const [records] = await trx
      .table(tableName)
      .delete()
      .where(columnNameId, id)
      .where(conditions)
      .returning('*');
    return records;
  }

  private hasProperty<T>(entity: T) {
    return Object.values(entity).some((value) => value !== undefined);
  }
}
