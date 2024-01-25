import { Injectable } from '@nestjs/common';
import {
  ConfigProps,
  DataConfig,
  IFindByIdAndVersionProps,
} from './knex.interface';
import { KnexRepository } from './knex.repository';

@Injectable()
export class KnexAuditRepository<T> extends KnexRepository<T> {
  async createWithAudit(data: T) {
    return await this.client.transaction(async (trx) => {
      const [createdRecord] = await trx
        .table(this.tableName)
        .insert(data)
        .returning('*');

      await trx.table(this.tableNameHistory).insert(createdRecord);

      return createdRecord;
    });
  }

  async findByIdAndVersion(props: IFindByIdAndVersionProps) {
    return await this.client
      .select('*')
      .where(props.columnName, props.id)
      .where('version', props.version)
      .table(`${this.tableName}_history`)
      .first();
  }

  async createTwoRelationWithOnceAudit(
    firstData: ConfigProps,
    secondData: ConfigProps,
    config: {
      referenceNameRelationId: string;
      renameProps: boolean;
      firstDataConfig: DataConfig;
      secondDataConfig: DataConfig;
    },
  ) {
    return await this.client.transaction(async (trx) => {
      const [createdFirstRecord] = await trx
        .table(firstData.tableName)
        .insert(firstData.data)
        .returning('*');

      secondData.data[config.referenceNameRelationId] = createdFirstRecord.id;
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

      const innerCreatedRecords = {
        ...createdFirstRecord,
        ...createdSecondRecord,
      };

      await trx.table(this.tableNameHistory).insert(innerCreatedRecords);

      return innerCreatedRecords;
    });
  }

  async updateWithAudit(id: string | number, data: T) {
    return await this.client.transaction(async (trx) => {
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
    return await this.client.transaction(async (trx) => {
      const [updatedFirstRecord] = await trx
        .table(firstData.tableName)
        .update(firstData.data)
        .where('id', firstData.data.id)
        .returning('*');

      if (!updatedFirstRecord) {
        throw new Error(`There are some error for first entity`);
      }

      const [updatedSecondRecord] = await trx
        .table(secondData.tableName)
        .update(secondData.data)
        .where(config.referenceNameRelationId, firstData.data.id)
        .returning('*');

      if (!updatedSecondRecord) {
        throw new Error(`There are some error for second entity`);
      }

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

  async deleteWithAudit(id: string | number) {
    const timestamp = new Date().toISOString();
    const deletedRecord = await this.client.transaction(async (trx) => {
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

  async deleteTwoRelationWithOnceAuditByRelationId(
    firstData: ConfigProps,
    secondData: ConfigProps,
    config: {
      referenceNameRelationId: string;
      renameProps: boolean;
      firstDataConfig: DataConfig;
      secondDataConfig: DataConfig;
    },
  ) {
    const timestamp = new Date().toISOString();
    return await this.client.transaction(async (trx) => {
      const [deletedSecondRecord] = await trx
        .table(secondData.tableName)
        .delete()
        .where(config.referenceNameRelationId, firstData.data.id)
        .returning('*');

      await trx
        .table(firstData.tableName)
        .update({ deleted_at: timestamp })
        .where('id', firstData.data.id)
        .returning('*');

      const [deletedFirstRecord] = await trx
        .table(firstData.tableName)
        .delete()
        .where('id', firstData.data.id)
        .returning('*');

      if (config.renameProps) {
        deletedFirstRecord[config.firstDataConfig.newName] =
          deletedFirstRecord[config.firstDataConfig.oldName];
        delete deletedFirstRecord[config.firstDataConfig.oldName];

        deletedSecondRecord[config.secondDataConfig.newName] =
          deletedSecondRecord[config.secondDataConfig.oldName];
        delete deletedSecondRecord[config.secondDataConfig.oldName];
      }

      const innerDeletedRecords = {
        ...deletedFirstRecord,
        ...deletedSecondRecord,
      };

      await trx.table(this.tableNameHistory).insert(innerDeletedRecords);

      return innerDeletedRecords;
    });
  }
}
