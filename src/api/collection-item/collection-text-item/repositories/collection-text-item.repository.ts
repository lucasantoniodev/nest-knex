import { Injectable } from '@nestjs/common';
import { deleteProperty, renameIdProperty } from 'src/helper';
import { KnexAppRepository } from 'src/knex/knex.repository';
import { RevisionModel } from 'src/models/revision.model';
import { CollectionItemModel } from '../../models/collection-item.model';
import { TextItemHistory } from '../models/text-item-history.model';
import { TextItemModel } from '../models/text-item.model';

@Injectable()
export class CollectionTextItemRepository {
  constructor(private readonly knexRepository: KnexAppRepository) {}

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

      // Criar mapper para customizar o model
      return {
        ...baseEntityCreated,
        ...childEntityCreated,
      };
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

      // Criar mapper para customizar o model
      return {
        ...baseEntityUpdated,
        ...childEntityUpdated,
      };
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

      // Criar mapper para customizar o model
      return {
        ...childEntityDeleted,
        ...baseEntityDeleted,
      };
    });
  }

  private applyIdRelationAndReturnEntity(
    id: string,
    textItemEntity: TextItemModel,
  ) {
    textItemEntity.collection_item_id = id;
    return textItemEntity;
  }
}
