import { Injectable } from '@nestjs/common';
import { deleteProperty, renameIdProperty } from 'src/helper';
import { KnexNewRepository } from 'src/knex/knex-new.repository';
import { RevisionModel } from 'src/models/revision.model';
import { CollectionItemModel } from '../../models/collection-item.model';
import { TextItemHistory } from '../models/text-item-history.model';
import { TextItemModel } from '../models/text-item.model';

@Injectable()
export class CollectionTextItemRepository {
  constructor(private readonly knexRepository: KnexNewRepository) {}

  public async create(
    collectionItemEntity: CollectionItemModel,
    textItemEntity: TextItemModel,
  ) {
    return await this.knexRepository.executeTransaction(async (trx) => {
      const baseEntityCreated =
        await this.knexRepository.create<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: collectionItemEntity,
        });
      const childEntityCreated =
        await this.knexRepository.create<TextItemModel>({
          trx,
          tableName: 'text_item',
          entity: this.applyIdRelationAndReturnEntity(
            baseEntityCreated.id,
            textItemEntity,
          ),
        });
      const revisionCreated = await this.knexRepository.create<RevisionModel>({
        trx,
        tableName: 'revision_history',
        entity: { user: 'Administrador' },
      });
      return await this.knexRepository.create<TextItemHistory>({
        trx,
        tableName: 'text_item_history',
        entity: this.generateHistoryEntity(
          baseEntityCreated,
          childEntityCreated,
          revisionCreated,
        ),
      });
    });
  }

  public async findById(id: string) {
    return await this.knexRepository.findByIdWithJoin({
      tableName: 'collection_item',
      joinTableName: 'text_item',
      joinColumnName: 'collection_item_id',
      id,
    });
  }

  public async update(
    id: string | number,
    collectionItemEntity: CollectionItemModel,
    textItemEntity: TextItemModel,
  ) {
    return this.knexRepository.executeTransaction(async (trx) => {
      const baseEntityUpdated =
        await this.knexRepository.update<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: collectionItemEntity,
          id,
        });
      const childEntityUpdated =
        await this.knexRepository.update<TextItemModel>({
          trx,
          tableName: 'text_item',
          columnNameId: 'collection_item_id',
          entity: textItemEntity,
          id,
        });
      const revisionCreated = await this.knexRepository.create<RevisionModel>({
        trx,
        tableName: 'revision_history',
        entity: { user: 'Administrador' },
      });
      return await this.knexRepository.create<TextItemHistory>({
        trx,
        tableName: 'text_item_history',
        entity: this.generateHistoryEntity(
          baseEntityUpdated,
          childEntityUpdated,
          revisionCreated,
        ),
      });
    });
  }

  public async delete(id: string) {
    return this.knexRepository.executeTransaction(async (trx) => {
      const childEntityDeleted =
        await this.knexRepository.delete<TextItemModel>({
          trx,
          tableName: 'text_item',
          columnNameId: 'collection_item_id',
          id,
        });
      const baseEntityDeleted =
        await this.knexRepository.delete<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: {
            updated_at: trx.fn.now(),
            deleted_at: trx.fn.now(),
            version: trx.raw('"version" + 1'),
          } as any,
          id,
        });
      const revisionCreated = await this.knexRepository.create<RevisionModel>({
        trx,
        tableName: 'revision_history',
        entity: { user: 'Administrador' },
      });
      return await this.knexRepository.create<TextItemHistory>({
        trx,
        tableName: 'text_item_history',
        entity: this.generateHistoryEntity(
          baseEntityDeleted,
          childEntityDeleted,
          revisionCreated,
        ),
      });
    });
  }

  private generateHistoryEntity(
    collectionItem: CollectionItemModel,
    textItem: TextItemModel,
    revision: RevisionModel,
  ): TextItemHistory {
    return {
      text_item_id: textItem.id,
      collection_item_id: collectionItem.id,
      min_length: textItem.min_length,
      max_length: textItem.max_length,
      validate_min_length: textItem.validate_min_length,
      type: collectionItem.type,
      code: collectionItem.code,
      workcenter_id: collectionItem.workcenter_id,
      title: collectionItem.title,
      description: collectionItem.description,
      filePath: collectionItem.filePath,
      expiry_date: collectionItem.expiry_date,
      version: collectionItem.version,
      created_at: collectionItem.created_at,
      updated_at: collectionItem.updated_at,
      deleted_at: collectionItem.deleted_at,
      revision_history_id: revision.id,
    };
  }

  private applyIdRelationAndReturnEntity(
    id: string,
    textItemEntity: TextItemModel,
  ) {
    textItemEntity.collection_item_id = id;
    return textItemEntity;
  }
}
