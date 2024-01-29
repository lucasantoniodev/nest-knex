// import { Injectable } from '@nestjs/common';
// import { Knex } from 'knex';
// import {} from './knex.interface';
// import { KnexRepository } from './knex.repository';

// @Injectable()
// export class KnexAuditRepository<T, A> extends KnexRepository<T> {
//   public async findAuditByIdAndVersion(
//     props: IFindByIdAndVersionProps,
//   ): Promise<A> {
//     return this.transaction(async (trx) => {
//       return await trx
//         .select('*')
//         .where(props?.columnName ?? 'id', props.id)
//         .where('version', props.version)
//         .table(this.tableNameHistory)
//         .first();
//     });
//   }

//   public async createSimpleAudit({
//     data,
//     tableName,
//     tableNameHistory,
//   }: {
//     data: T;
//     tableName: string;
//     tableNameHistory: string;
//   }): Promise<T> {
//     return this.transaction(async (trx) => {
//       const createdRecord = this.validateEntity(
//         await this.insertAndReturn({ trx, data, tableName }),
//       );
//       await this.insertHistory(trx, createdRecord, tableNameHistory);
//       return createdRecord;
//     });
//   }

//   //Refatorado
//   public async createInheritanceAudit(
//     props: IActionInheritanceProps,
//   ): Promise<A> {
//     return await this.transaction(async (trx) => {
//       const createdFirstRecord = this.validateEntity(
//         await this.insertAndReturn({
//           trx,
//           data: props.baseData.data,
//           tableName: props.baseData.tableName,
//         }),
//       );

//       props.childData.data[props.referenceNameRelationId] =
//         createdFirstRecord.id;
//       const createdSecondRecord = this.validateEntity(
//         await this.insertAndReturn({
//           trx,
//           data: props.childData.data,
//           tableName: props.childData.tableName,
//         }),
//       );

//       if (props.config.hasRename) {
//         this.renameProperties(createdFirstRecord, props.config.baseDataConfig);
//         this.renameProperties(
//           createdSecondRecord,
//           props.config.childDataConfig,
//         );
//       }

//       const revision = await this.insertAndReturn({
//         trx,
//         data: {
//           user: 'Fulano',
//         },
//         tableName: 'revision_history',
//       });

//       const innerCreatedRecords = {
//         ...createdFirstRecord,
//         ...createdSecondRecord,
//       };

//       await this.insertHistory(
//         trx,
//         { ...innerCreatedRecords, revision_history_id: revision.id },
//         props.childData.tableNameHistory,
//       );

//       return { ...innerCreatedRecords, revision_history_id: revision.id };
//     });
//   }

//   public async createManyInheritanceAudit(
//     props: IActionInheritanceProps,
//   ): Promise<A> {
//     return await this.transaction(async (trx) => {
//       const createdBaseRecord = this.validateEntity(
//         await this.insertAndReturn({
//           trx,
//           data: props.baseData.data,
//           tableName: props.baseData.tableName,
//         }),
//       );

//       props.childData.data[props.referenceNameRelationId] =
//         createdBaseRecord.id;
//       const createdChildRecord = this.validateEntity(
//         await this.insertAndReturn({
//           trx,
//           data: props.childData.data,
//           tableName: props.childData.tableName,
//         }),
//       );

//       if (props.grandChildData.data instanceof Array) {
//         props.grandChildData.data.map((data) => {
//           data[props.referenceNameRelationGrandChildId] = createdChildRecord.id;
//         });
//       }
//       const createdGrandChildRecord = this.validateEntity(
//         await this.insertAndReturn({
//           trx,
//           data: props.grandChildData.data,
//           tableName: props.grandChildData.tableName,
//         }),
//       );

//       if (props.config.hasRename) {
//         this.renameProperties(createdBaseRecord, props.config.baseDataConfig);
//         this.renameProperties(createdChildRecord, props.config.childDataConfig);
//         this.renameProperties(
//           createdGrandChildRecord,
//           props.config.grandChildDataConfig,
//         );
//       }

//       const revision = await this.insertAndReturn({
//         trx,
//         data: {
//           user: 'Fulano',
//         },
//         tableName: 'revision_history',
//       });

//       if (createdGrandChildRecord instanceof Array) {
//         createdGrandChildRecord.forEach(async (data) => {
//           await this.insertHistory(
//             trx,
//             { ...data, revision_history_id: revision.id },
//             props.grandChildData.tableNameHistory,
//           );
//         });
//       } else {
//         await this.insertHistory(
//           trx,
//           { ...createdGrandChildRecord, revision_history_id: revision.id },
//           props.grandChildData.tableNameHistory,
//         );
//       }

//       const innerCreatedRecords = {
//         ...createdBaseRecord,
//         ...createdChildRecord,
//       };

//       await this.insertHistory(
//         trx,
//         { ...innerCreatedRecords, revision_history_id: revision.id },
//         props.childData.tableNameHistory,
//       );

//       return { ...innerCreatedRecords, revision_history_id: revision.id };
//     });
//   }

//   public async updateSimpleAudit(id: string | number, data: T): Promise<T> {
//     return await this.transaction(async (trx) => {
//       const [updatedRecord] = this.validateEntity(
//         await trx
//           .table(this.tableName)
//           .update(data)
//           .where('id', id)
//           .returning('*'),
//       );
//       await trx.table(this.tableNameHistory).insert(updatedRecord);
//       return updatedRecord;
//     });
//   }

//   public async updateInheritanceAudit(
//     props: IActionInheritanceProps,
//   ): Promise<A> {
//     return await this.client.transaction(async (trx) => {
//       const updatedFirstRecord = this.validateEntity(
//         await this.updateAndReturn({
//           trx,
//           id: props.baseData.data.id,
//           data: props.baseData.data,
//           tableName: props.baseData.tableName,
//         }),
//       );

//       const updatedSecondRecord = this.validateEntity(
//         await this.updateAndReturn({
//           trx,
//           id: props.baseData.data.id,
//           data: props.childData.data,
//           tableName: props.childData.tableName,
//           columnName: props.referenceNameRelationId,
//         }),
//       );

//       if (props.config.hasRename) {
//         this.renameProperties(updatedFirstRecord, props.config.baseDataConfig);
//         this.renameProperties(
//           updatedSecondRecord,
//           props.config.childDataConfig,
//         );
//       }

//       const revision = await this.insertAndReturn({
//         trx,
//         data: {
//           user: 'Fulano',
//         },
//         tableName: 'revision_history',
//       });

//       const innerUpdatedRecords = {
//         ...updatedFirstRecord,
//         ...updatedSecondRecord,
//       };

//       await this.insertHistory(
//         trx,
//         { ...innerUpdatedRecords, revision_history_id: revision.id },
//         props.childData.tableNameHistory,
//       );

//       return { ...innerUpdatedRecords, revision_history_id: revision.id };
//     });
//   }

//   public async updateManyInheritanceAudit(
//     props: IActionInheritanceProps,
//   ): Promise<A> {
//     return await this.client.transaction(async (trx) => {
//       const baseDataId = props.baseData.data.id;
//       delete props.baseData.data.id;
//       const updatedBaseRecord = this.validateEntity(
//         await this.updateAndReturn({
//           trx,
//           id: baseDataId,
//           data: props.baseData.data,
//           tableName: props.baseData.tableName,
//         }),
//       );

//       props.childData.data[props.referenceNameRelationId] = baseDataId;
//       const updatedChildRecord = this.validateEntity(
//         await this.updateAndReturn({
//           trx,
//           id: baseDataId,
//           data: props.childData.data,
//           tableName: props.childData.tableName,
//           columnName: props.referenceNameRelationId,
//         }),
//       );

//       if (props.grandChildData.data instanceof Array) {
//         props.grandChildData.data.forEach(async (data) => {
//           const idGrandChild = data.id;
//           delete data.id;
//           this.validateEntity(
//             await this.updateAndReturnByTwoColumns({
//               trx,
//               id: idGrandChild,
//               data: data,
//               tableName: props.grandChildData.tableName,
//               columnName: props.config.childDataConfig.oldName,
//               secondColumnName: props.config.childDataConfig.newName,
//               secondId: updatedChildRecord.id,
//             }),
//           );
//         });
//       } else {
//         const idGrandChild = props.grandChildData.data.id;
//         delete props.grandChildData.data.id;
//         this.validateEntity(
//           await this.updateAndReturnByTwoColumns({
//             trx,
//             id: idGrandChild,
//             data: props.grandChildData.data,
//             tableName: props.grandChildData.tableName,
//             columnName: props.config.childDataConfig.oldName,
//             secondColumnName: props.config.childDataConfig.newName,
//             secondId: updatedChildRecord.id,
//           }),
//         );
//       }

//       const updatedGrandChildRecord = await trx
//         .table(props.grandChildData.tableName)
//         .select('*')
//         .where(props.referenceNameRelationGrandChildId, updatedChildRecord.id)
//         .returning('*');

//       if (props.config.hasRename) {
//         this.renameProperties(updatedBaseRecord, props.config.baseDataConfig);
//         this.renameProperties(updatedChildRecord, props.config.childDataConfig);
//         this.renameProperties(
//           updatedGrandChildRecord,
//           props.config.grandChildDataConfig,
//         );
//       }

//       const revision = await this.insertAndReturn({
//         trx,
//         data: {
//           user: 'Fulano',
//         },
//         tableName: 'revision_history',
//       });

//       updatedGrandChildRecord.forEach(async (data) => {
//         await this.insertHistory(
//           trx,
//           { ...data, revision_history_id: revision.id },
//           props.grandChildData.tableNameHistory,
//         );
//       });

//       const innerUpdatedRecords = {
//         ...updatedBaseRecord,
//         ...updatedChildRecord,
//       };

//       await this.insertHistory(
//         trx,
//         { ...innerUpdatedRecords, revision_history_id: revision.id },
//         props.childData.tableNameHistory,
//       );

//       return { ...innerUpdatedRecords, ...updatedGrandChildRecord };
//     });
//   }

//   public async deleteSimpleAudit(id: string | number): Promise<T> {
//     return await this.transaction(async (trx) => {
//       await this.updateSoftDelete({ trx, id });
//       const deletedRecord = this.validateEntity(
//         await this.deleteAndReturn({ trx, id }),
//       );
//       await this.insertHistory(trx, deletedRecord);
//       return deletedRecord;
//     });
//   }

//   public async deleteInheritanceAudit(
//     props: IActionInheritanceProps,
//   ): Promise<A> {
//     return await this.transaction(async (trx) => {
//       const deletedSecondRecord = this.validateEntity(
//         await this.deleteAndReturn({
//           trx,
//           id: props.baseData.data.id,
//           tableName: props.childData.tableName,
//           columnName: props.referenceNameRelationId,
//         }),
//       );

//       await this.updateSoftDelete({
//         trx,
//         id: props.baseData.data.id,
//         tableName: props.baseData.tableName,
//       });

//       const deletedFirstRecord = await this.validateEntity(
//         await this.deleteAndReturn({
//           trx,
//           id: props.baseData.data.id,
//           tableName: props.baseData.tableName,
//         }),
//       );

//       if (props.config.hasRename) {
//         this.renameProperties(deletedFirstRecord, props.config.baseDataConfig);
//         this.renameProperties(
//           deletedSecondRecord,
//           props.config.childDataConfig,
//         );
//       }

//       const revision = await this.insertAndReturn({
//         trx,
//         data: {
//           user: 'Fulano',
//         },
//         tableName: 'revision_history',
//       });

//       const innerDeletedRecords = {
//         ...deletedFirstRecord,
//         ...deletedSecondRecord,
//       };

//       await this.insertHistory(
//         trx,
//         {
//           ...innerDeletedRecords,
//           revision_history_id: revision.id,
//         },
//         props.childData.tableNameHistory,
//       );

//       return {
//         ...innerDeletedRecords,
//         revision_history_id: revision.id,
//       };
//     });
//   }

//   private validateEntity<T>(data: any) {
//     if (!data) throw new Error('Entity does not exists');
//     return data;
//   }

//   private async insertHistory(
//     trx: Knex.Transaction,
//     record: T,
//     tableNameHistory?: string,
//   ) {
//     await trx.table(tableNameHistory).insert(record);
//   }

//   private renameProperties(records: any | any[], config: DataConfig) {
//     const processRecord = (record: any) => {
//       record[config.newName] = record[config.oldName];
//       delete record[config.oldName];
//     };

//     if (Array.isArray(records)) {
//       records.forEach(processRecord);
//     } else {
//       processRecord(records);
//     }
//   }
// }
