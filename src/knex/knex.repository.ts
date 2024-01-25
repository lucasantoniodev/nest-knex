import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { IFindByIdProps } from './knex.interface';

@Injectable()
export class KnexRepository<T> implements OnModuleDestroy {
  public tableName: string = '';
  public tableNameHistory: string = `${this.tableName}_history`;

  constructor(@InjectKnex() private readonly knex: Knex) {}

  public onModuleDestroy() {
    if (this.knex) {
      this.knex.destroy();
      this.setTableName(null, null);
    }
  }

  public setTableName(tableName: string, tableNameHistory?: string) {
    this.tableName = tableName;
    if (tableNameHistory) this.tableNameHistory = tableNameHistory;
  }

  get client() {
    return this.knex;
  }

  async create(data: T) {
    const [createdRecord] = await this.knex
      .insert(data)
      .into(this.tableName)
      .returning('*');
    return createdRecord;
  }

  async update(id: string | number, data: T) {
    const [updatedRecord] = await this.knex
      .update(data)
      .where('id', id)
      .into(this.tableName)
      .returning('*');
    return updatedRecord;
  }

  async findAll() {
    return this.knex.select().table(this.tableName);
  }

  async findById(props: IFindByIdProps) {
    return this.knex
      .select()
      .where(props?.columnName ?? 'id', props.id)
      .table(this.tableName)
      .first();
  }

  async delete(id: string | number) {
    const timestamp = new Date().toISOString();
    return this.knex.transaction(async (trx) => {
      await trx
        .table(this.tableName)
        .update({ deleted_at: timestamp })
        .where('id', id);

      const [deletedRecord] = await trx
        .table(this.tableName)
        .delete()
        .where('id', id)
        .returning('*');

      return deletedRecord;
    });
  }

  protected async transaction(
    callback: (trx: Knex.Transaction) => Promise<any>,
  ) {
    let result: Promise<any>;
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

  protected async insertAndReturn(
    trx: Knex.Transaction,
    data: T,
    tableName?: string,
  ) {
    const [record] = await trx
      .table(tableName ?? this.tableName)
      .insert(data)
      .returning('*');
    return record;
  }

  protected async updateSoftDelete(props: {
    trx: Knex.Transaction;
    id: string | number;
    tableName?: string;
  }) {
    await props.trx
      .table(props?.tableName ?? this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .where('id', props.id);
  }

  protected async updateAndReturn(props: {
    trx: Knex.Transaction;
    id: string | number;
    data: any;
    tableName?: string;
    columnName?: string;
  }) {
    const [record] = await props.trx
      .table(props?.tableName ?? this.tableName)
      .update(props.data)
      .where(props?.columnName ?? 'id', props.id)
      .returning('*');
    return record;
  }

  protected async deleteAndReturn(props: {
    trx: Knex.Transaction;
    id: string | number;
    tableName?: string;
    columnName?: string;
  }) {
    const [record] = await props.trx
      .table(props?.tableName ?? this.tableName)
      .delete()
      .where(props?.columnName ?? 'id', props.id)
      .returning('*');
    return record;
  }
}
