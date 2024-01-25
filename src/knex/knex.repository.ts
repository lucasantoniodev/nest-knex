import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

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

  async findById(id: string | number) {
    return this.knex.select().where('id', id).table(this.tableName).first();
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
}
