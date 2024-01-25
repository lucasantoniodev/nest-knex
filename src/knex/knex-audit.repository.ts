import { Injectable } from '@nestjs/common';
import {
  AuditProps,
  DataConfig,
  IFindByIdAndVersionProps,
  IActionInheritanceProps,
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

  async createSimpleAudit(data: T) {
    return await this.transaction(async (trx) => {
      const createdRecord = this.validateEntity(
        await this.insertAndReturn(trx, data),
      );
      await this.insertHistory(trx, createdRecord);
      return createdRecord;
    });
  }

  async createInheritanceAudit(
    firstData: AuditProps,
    secondData: AuditProps,
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

  async updateTwoInOneAudit(props: IActionInheritanceProps) {
    return await this.client.transaction(async (trx) => {
      const updatedFirstRecord = this.validateEntity(
        await this.updateAndReturn({
          trx,
          id: props.baseData.data.id,
          data: props.baseData.data,
          tableName: props.baseData.tableName,
        }),
      );

      const updatedSecondRecord = this.validateEntity(
        await this.updateAndReturn({
          trx,
          id: props.baseData.data.id,
          data: props.childData.data,
          tableName: props.childData.tableName,
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

  async deleteForTwoInOneAudit(props: IActionInheritanceProps) {
    return await this.transaction(async (trx) => {
      const deletedSecondRecord = this.validateEntity(
        await this.deleteAndReturn({
          trx,
          id: props.baseData.data.id,
          tableName: props.childData.tableName,
          columnName: props.referenceNameRelationId,
        }),
      );

      await this.updateSoftDelete({
        trx,
        id: props.baseData.data.id,
        tableName: props.baseData.tableName,
      });

      const deletedFirstRecord = await this.validateEntity(
        await this.deleteAndReturn({
          trx,
          id: props.baseData.data.id,
          tableName: props.baseData.tableName,
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

  private validateEntity(data: any) {
    if (!data) throw new Error('Entity does not exists');
    return data;
  }

  private async insertHistory(trx: Knex.Transaction, record: T) {
    await trx.table(this.tableNameHistory).insert(record);
  }

  private renameProperties(record: any, config: DataConfig) {
    record[config.newName] = record[config.oldName];
    delete record[config.oldName];
  }
}
