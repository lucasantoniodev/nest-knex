import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { KnexAuditListenRepository } from './knexAuditListen.repository';

@Injectable()
export class KnexRepository
  extends KnexAuditListenRepository
  implements OnModuleDestroy
{
  private table: string;

  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(knex);
  }

  public setTableName(tableName: string, tableNameHistory?: string) {
    this.table = tableName;
    super.applyTableNames(tableName, tableNameHistory);
  }

  async createWithAudit(data: any) {
    const [createdRecord] = await this.knex
      .insert(data)
      .into(this.table)
      .returning('*');
    this.eventEmitter.emit('audit', createdRecord);
    return createdRecord;
  }

  async create(data: any) {
    const [createdRecord] = await this.knex
      .insert(data)
      .into(this.table)
      .returning('*');
    return createdRecord;
  }

  async update(id: string | number, data: any) {
    const [updatedRecord] = await this.knex
      .update(data)
      .where('id', id)
      .into(this.table)
      .returning('*');
    return updatedRecord;
  }

  async updateWithAudit(id: string | number, data: any) {
    const [updatedRecord] = await this.knex
      .update(data)
      .where('id', id)
      .into(this.table)
      .returning('*');
    this.eventEmitter.emit('audit', updatedRecord);
    return updatedRecord;
  }

  async findAll() {
    return this.knex.select().table(this.table);
  }

  async findById(id: string | number) {
    return this.knex.select().where('id', id).table(this.table).first();
  }

  async findByIdAndVersion(id: string | number, version: number) {
    return await this.knex
      .select('*')
      .where('id', id)
      .where('version', version)
      .table(`${this.table}_history`)
      .first();
  }

  async delete(id: string | number) {
    const timestamp = new Date().toISOString();
    return this.knex.transaction(async (trx) => {
      await trx
        .table(this.table)
        .update({ deleted_at: timestamp })
        .where('id', id);

      const [deletedRecord] = await trx
        .table(this.table)
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
        .table(this.table)
        .update({ deleted_at: timestamp })
        .where('id', id);

      const [deletedRecord] = await trx
        .table(this.table)
        .delete()
        .where('id', id)
        .returning('*');

      return deletedRecord;
    });
    this.eventEmitter.emit('audit', deletedRecord);
    return deletedRecord;
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.destroy();
      this.setTableName(null, null);
    }
  }
}
