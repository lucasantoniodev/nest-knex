import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  DataConfig,
  IActionInheritanceProps,
  IFindByIdAndVersionProps,
} from './knex.interface';
import { KnexRepository } from './knex.repository';

@Injectable()
export class KnexAuditRepository<T, A> extends KnexRepository<T> {
  public async findAuditByIdAndVersion(
    props: IFindByIdAndVersionProps,
  ): Promise<A> {
    return this.transaction(async (trx) => {
      return await trx
        .select('*')
        .where(props?.columnName ?? 'id', props.id)
        .where('version', props.version)
        .table(this.tableNameHistory)
        .first();
    });
  }

  public async createSimpleAudit(data: T): Promise<T> {
    return await this.transaction(async (trx) => {
      const createdRecord = this.validateEntity(
        await this.insertAndReturn({ trx, data }),
      );
      await this.insertHistory(trx, createdRecord);
      return createdRecord;
    });
  }

  public async createInheritanceAudit(
    props: IActionInheritanceProps,
  ): Promise<A> {
    return await this.transaction(async (trx) => {
      const createdFirstRecord = this.validateEntity(
        await this.insertAndReturn({
          trx,
          data: props.baseData.data,
          tableName: props.baseData.tableName,
        }),
      );

      props.childData.data[props.referenceNameRelationId] =
        createdFirstRecord.id;
      const createdSecondRecord = this.validateEntity(
        await this.insertAndReturn({
          trx,
          data: props.childData.data,
          tableName: props.childData.tableName,
        }),
      );

      if (props.config.renameProps) {
        this.renameProperties(createdFirstRecord, props.config.baseDataConfig);
        this.renameProperties(
          createdSecondRecord,
          props.config.childDataConfig,
        );
      }

      const innerCreatedRecords = {
        ...createdFirstRecord,
        ...createdSecondRecord,
      };

      await this.insertHistory(trx, innerCreatedRecords);

      return innerCreatedRecords;
    });
  }

  public async updateSimpleAudit(id: string | number, data: T): Promise<T> {
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

  public async updateInheritanceAudit(
    props: IActionInheritanceProps,
  ): Promise<A> {
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
        this.renameProperties(updatedFirstRecord, props.config.baseDataConfig);
        this.renameProperties(
          updatedSecondRecord,
          props.config.childDataConfig,
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

  public async deleteSimpleAudit(id: string | number): Promise<T> {
    return await this.transaction(async (trx) => {
      await this.updateSoftDelete({ trx, id });
      const deletedRecord = this.validateEntity(
        await this.deleteAndReturn({ trx, id }),
      );
      await this.insertHistory(trx, deletedRecord);
      return deletedRecord;
    });
  }

  public async deleteInheritanceAudit(
    props: IActionInheritanceProps,
  ): Promise<A> {
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
        this.renameProperties(deletedFirstRecord, props.config.baseDataConfig);
        this.renameProperties(
          deletedSecondRecord,
          props.config.childDataConfig,
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
