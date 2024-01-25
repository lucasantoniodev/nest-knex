import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class KnexRepository<T> implements OnModuleDestroy {
  public tableName: string = '';
  public tableNameHistory: string = `${this.tableName}_history`;

  public constructor(@InjectKnex() private readonly knex: Knex) {}

  public onModuleDestroy() {
    if (this.knex) {
      this.knex.destroy();
      this.setTableName(null, null);
    }
  }

  public get client() {
    return this.knex;
  }

  public setTableName(tableName: string, tableNameHistory?: string) {
    this.tableName = tableName;
    if (tableNameHistory) this.tableNameHistory = tableNameHistory;
  }

  public async create(data: T): Promise<T> {
    return await this.transaction(async (trx) => {
      return await this.insertAndReturn({ trx, data });
    });
  }

  public async update(id: string | number, data: T): Promise<T> {
    return await this.transaction(async (trx) => {
      return await this.updateAndReturn({ trx, id, data });
    });
  }

  public async findAll(): Promise<T[]> {
    return await this.transaction(async (trx) => {
      return trx.table(this.tableName).select();
    });
  }

  public async findById(id: string | number): Promise<T> {
    return await this.transaction(async (trx) => {
      return trx.table(this.tableName).select().where('id', id).first();
    });
  }

  public async delete(id: string | number): Promise<T> {
    return await this.transaction(async (trx) => {
      await this.updateSoftDelete({ trx, id });
      return await this.deleteAndReturn({ trx, id });
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

  protected async insertAndReturn(props: {
    trx: Knex.Transaction;
    data: T;
    tableName?: string;
  }) {
    const [record] = await props.trx
      .table(props?.tableName ?? this.tableName)
      .insert(props.data)
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
