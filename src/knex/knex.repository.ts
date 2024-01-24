import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class KnexRepository implements OnModuleDestroy {
  private tableName: string = '';
  private tableNameHistory: string = `${this.tableName}_history`;

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

  async getClientInstance() {
    return this.knex;
  }

  async createWithAudit(data: any) {
    return await this.knex.transaction(async (trx) => {
      const [createdRecord] = await trx
        .table(this.tableName)
        .insert(data)
        .returning('*');

      await trx.table(this.tableNameHistory).insert(createdRecord);

      return createdRecord;
    });
  }

  async create(data: any) {
    const [createdRecord] = await this.knex
      .insert(data)
      .into(this.tableName)
      .returning('*');
    return createdRecord;
  }

  async update(id: string | number, data: any) {
    const [updatedRecord] = await this.knex
      .update(data)
      .where('id', id)
      .into(this.tableName)
      .returning('*');
    return updatedRecord;
  }

  async updateWithAudit(id: string | number, data: any) {
    return await this.knex.transaction(async (trx) => {
      const [updatedRecord] = await trx
        .table(this.tableName)
        .update(data)
        .where('id', id)
        .returning('*');

      await trx.table(this.tableNameHistory).insert(updatedRecord);

      return updatedRecord;
    });
  }

  async findAll() {
    return this.knex.select().table(this.tableName);
  }

  async findById(id: string | number) {
    return this.knex.select().where('id', id).table(this.tableName).first();
  }

  async findByIdAndVersion(id: string | number, version: number) {
    return await this.knex
      .select('*')
      .where('id', id)
      .where('version', version)
      .table(`${this.tableName}_history`)
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

  async deleteWithAudit(id: string | number) {
    const timestamp = new Date().toISOString();
    const deletedRecord = await this.knex.transaction(async (trx) => {
      await trx
        .table(this.tableName)
        .update({ deleted_at: timestamp })
        .where('id', id);

      const [deletedRecord] = await trx
        .table(this.tableName)
        .delete()
        .where('id', id)
        .returning('*');

      await trx.table(this.tableNameHistory).insert(deletedRecord);

      return deletedRecord;
    });

    return deletedRecord;
  }
}
