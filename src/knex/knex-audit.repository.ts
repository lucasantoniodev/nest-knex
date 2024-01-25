import { Injectable } from '@nestjs/common';
import {
  ConfigProps,
  DataConfig,
  IFindByIdAndVersionProps,
  IActionForTwoTablesProps,
} from './knex.interface';
import { KnexRepository } from './knex.repository';
import { Knex } from 'knex';

@Injectable()
export class KnexAuditRepository<T> extends KnexRepository<T> {
  async findByIdAndVersion(props: IFindByIdAndVersionProps) {
    return await this.client
      .select('*')
      .where(props?.columnName ?? 'id', props.id)
      .where('version', props.version)
      .table(this.tableNameHistory)
      .first();
  }

  async createOneAudit(data: T) {
    return await this.transaction(async (trx) => {
      const createdRecord = this.validateEntity(
        await this.insertAndReturn(trx, data),
      );
      await this.insertHistory(trx, createdRecord);
      return createdRecord;
    });
  }

  async createTwoInOneAudit(
    firstData: ConfigProps,
    secondData: ConfigProps,
    config: {
      referenceNameRelationId: string;
      renameProps: boolean;
      firstDataConfig: DataConfig;
      secondDataConfig: DataConfig;
    },
  ) {
    return await this.transaction(async (trx) => {
      const createdFirstRecord = this.validateEntity(
        await this.insertAndReturn(trx, firstData.data, firstData.tableName),
      );

      secondData.data[config.referenceNameRelationId] = createdFirstRecord.id;
      const createdSecondRecord = this.validateEntity(
        await this.insertAndReturn(trx, secondData.data, secondData.tableName),
      );

      if (config.renameProps) {
        this.renameProperties(createdFirstRecord, config.firstDataConfig);
        this.renameProperties(createdSecondRecord, config.secondDataConfig);
      }

      const innerCreatedRecords = {
        ...createdFirstRecord,
        ...createdSecondRecord,
      };

      await this.insertHistory(trx, innerCreatedRecords);

      return innerCreatedRecords;
    });
  }

  async updateOneAudit(id: string | number, data: T) {
    return await this.transaction(async (trx) => {
      const [updatedRecord] = this.validateEntity(
        await trx
          .table(this.tableName)
          .update(data)
          .where('id', id)
          .returning('*'),
      );
      await trx.table(this.tableNameHistory).insert(updatedRecord);
      return updatedRecord;
    });
  }

  async updateTwoInOneAudit(props: IActionForTwoTablesProps) {
    return await this.client.transaction(async (trx) => {
      const updatedFirstRecord = this.validateEntity(
        await this.updateAndReturn({
          trx,
          id: props.firstData.data.id,
          data: props.firstData.data,
          tableName: props.firstData.tableName,
        }),
      );

      const updatedSecondRecord = this.validateEntity(
        await this.updateAndReturn({
          trx,
          id: props.firstData.data.id,
          data: props.secondData.data,
          tableName: props.secondData.tableName,
          columnName: props.referenceNameRelationId,
        }),
      );

      if (props.config.renameProps) {
        this.renameProperties(updatedFirstRecord, props.config.firstDataConfig);
        this.renameProperties(
          updatedSecondRecord,
          props.config.secondDataConfig,
        );
      }

      const innerUpdatedRecords = {
        ...updatedFirstRecord,
        ...updatedSecondRecord,
      };

      await this.insertHistory(trx, innerUpdatedRecords);

      return innerUpdatedRecords;
    });
  }

  async deleteOneAudit(id: string | number) {
    return await this.transaction(async (trx) => {
      await this.updateSoftDelete({ trx, id });
      const deletedRecord = this.validateEntity(
        await this.deleteAndReturn({ trx, id }),
      );
      await this.insertHistory(trx, deletedRecord);
      return deletedRecord;
    });
  }

  async deleteForTwoInOneAudit(props: IActionForTwoTablesProps) {
    return await this.transaction(async (trx) => {
      const deletedSecondRecord = this.validateEntity(
        await this.deleteAndReturn({
          trx,
          id: props.firstData.data.id,
          tableName: props.secondData.tableName,
          columnName: props.referenceNameRelationId,
        }),
      );

      await this.updateSoftDelete({
        trx,
        id: props.firstData.data.id,
        tableName: props.firstData.tableName,
      });

      const deletedFirstRecord = await this.validateEntity(
        await this.deleteAndReturn({
          trx,
          id: props.firstData.data.id,
          tableName: props.firstData.tableName,
        }),
      );

      if (props.config.renameProps) {
        this.renameProperties(deletedFirstRecord, props.config.firstDataConfig);
        this.renameProperties(
          deletedSecondRecord,
          props.config.secondDataConfig,
        );
      }

      const innerDeletedRecords = {
        ...deletedFirstRecord,
        ...deletedSecondRecord,
      };

      await this.insertHistory(trx, innerDeletedRecords);

      return innerDeletedRecords;
    });
  }

  private async transaction(callback: (trx: Knex.Transaction) => Promise<any>) {
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

  private validateEntity(data: any) {
    if (!data) throw new Error('Entity does not exists');
    return data;
  }

  private async insertAndReturn(
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

  private async insertHistory(trx: Knex.Transaction, record: T) {
    await trx.table(this.tableNameHistory).insert(record);
  }

  private renameProperties(record: any, config: DataConfig) {
    record[config.newName] = record[config.oldName];
    delete record[config.oldName];
  }

  private async updateAndReturn(props: {
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
  private async deleteAndReturn(props: {
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

  private async updateSoftDelete(props: {
    trx: Knex.Transaction;
    id: string | number;
    tableName?: string;
  }) {
    await props.trx
      .table(props?.tableName ?? this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .where('id', props.id);
  }
}
