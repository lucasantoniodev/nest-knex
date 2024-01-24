import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { config } from 'process';

interface ConfigProps {
  tableName?: string;
  data?: any;
}

interface DataConfig {
  oldName?: string;
  newName?: string;
}

//Extrair os métodos auditáveis para outra classe

@Injectable()
export class KnexRepository<T> implements OnModuleDestroy {
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

  async create(data: T) {
    const [createdRecord] = await this.knex
      .insert(data)
      .into(this.tableName)
      .returning('*');
    return createdRecord;
  }

  async createWithAudit(data: T) {
    return await this.knex.transaction(async (trx) => {
      const [createdRecord] = await trx
        .table(this.tableName)
        .insert(data)
        .returning('*');

      await trx.table(this.tableNameHistory).insert(createdRecord);

      return createdRecord;
    });
  }

  async createTwoRelationWithOnceAudit(
    firstData: ConfigProps,
    secondData: ConfigProps,
    config: {
      nameToRelationSecondRecord: string;
      renameProps: boolean;
      firstDataConfig: DataConfig;
      secondDataConfig: DataConfig;
    },
  ) {
    return await this.knex.transaction(async (trx) => {
      const [createdFirstRecord] = await trx
        .table(firstData.tableName)
        .insert(firstData.data)
        .returning('*');

      secondData.data[config.nameToRelationSecondRecord] =
        createdFirstRecord.id;
      const [createdSecondRecord] = await trx
        .table(secondData.tableName)
        .insert(secondData.data)
        .returning('*');

      if (config.renameProps) {
        createdFirstRecord[config.firstDataConfig.newName] =
          createdFirstRecord[config.firstDataConfig.oldName];
        delete createdFirstRecord[config.firstDataConfig.oldName];

        createdSecondRecord[config.secondDataConfig.newName] =
          createdSecondRecord[config.secondDataConfig.oldName];
        delete createdSecondRecord[config.secondDataConfig.oldName];
      }

      const innerUpdatedRecords = {
        ...createdFirstRecord,
        ...createdSecondRecord,
      };

      await trx.table(this.tableNameHistory).insert(innerUpdatedRecords);

      return innerUpdatedRecords;
    });
  }

  async update(id: string | number, data: T) {
    const [updatedRecord] = await this.knex
      .update(data)
      .where('id', id)
      .into(this.tableName)
      .returning('*');
    return updatedRecord;
  }

  async updateWithAudit(id: string | number, data: T) {
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

  async updateTwoRelationWithOnceAudit(
    firstData: ConfigProps,
    secondData: ConfigProps,
    config: {
      referenceNameRelationId: string;
      renameProps: boolean;
      firstDataConfig: DataConfig;
      secondDataConfig: DataConfig;
    },
  ) {
    return await this.knex.transaction(async (trx) => {
      const [updatedFirstRecord] = await trx
        .table(firstData.tableName)
        .update(firstData.data)
        .where('id', firstData.data.id)
        .returning('*');

      console.log(secondData.data);
      const [updatedSecondRecord] = await trx
        .table(secondData.tableName)
        .update(secondData.data)
        .where(config.referenceNameRelationId, firstData.data.id)
        .returning('*');

      if (config.renameProps) {
        updatedFirstRecord[config.firstDataConfig.newName] =
          updatedFirstRecord[config.firstDataConfig.oldName];
        delete updatedFirstRecord[config.firstDataConfig.oldName];

        updatedSecondRecord[config.secondDataConfig.newName] =
          updatedSecondRecord[config.secondDataConfig.oldName];
        delete updatedSecondRecord[config.secondDataConfig.oldName];
      }

      const innerUpdatedRecords = {
        ...updatedFirstRecord,
        ...updatedSecondRecord,
      };

      await trx.table(this.tableNameHistory).insert(innerUpdatedRecords);

      return innerUpdatedRecords;
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
