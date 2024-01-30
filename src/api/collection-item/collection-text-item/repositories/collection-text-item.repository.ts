import { Injectable } from '@nestjs/common';
import { KnexAppRepository } from 'src/knex/knex.repository';
import { CollectionItemModel } from '../../models/collection-item.model';
import { TextItemRevision } from '../models/text-item-history.model';
import { TextItemModel } from '../models/text-item.model';

@Injectable()
export class CollectionTextItemRepository {
  constructor(private readonly knexRepository: KnexAppRepository) {}

  public async create(
    collectionItemEntity: CollectionItemModel,
    textItemEntity: TextItemModel,
  ) {
    return this.knexRepository.executeTransaction(async (trx) => {
      const collectionItemCreated =
        await this.knexRepository.create<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: collectionItemEntity,
        });

      const textItemCreated = await this.knexRepository.create<TextItemModel>({
        trx,
        tableName: 'text_item',
        entity: this.applyIdRelationAndReturnEntity(
          collectionItemCreated.id,
          textItemEntity,
        ),
      });

      return await this.knexRepository.create<TextItemRevision>({
        trx,
        tableName: 'text_item_revision',
        entity: this.generateTextItemRevision(
          collectionItemCreated,
          textItemCreated,
        ),
      });
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

      return {
        ...baseEntityUpdated,
        ...childEntityUpdated,
      };
    });
  }

  private generateTextItemRevision(
    collectionItem: CollectionItemModel,
    textItem: TextItemModel,
  ): TextItemRevision {
    return {
      type: collectionItem.type,
      code: collectionItem.code,
      organizational_resource_plant_id:
        collectionItem.organizational_resource_plant_id,
      title: collectionItem.title,
      description: collectionItem.description,
      file_path: collectionItem.file_path,
      expiry_date: collectionItem.expiry_date,
      min_length: textItem.min_length,
      max_length: textItem.max_length,
      validate_min_length: textItem.validate_min_length,
      collection_item_id: textItem.collection_item_id,
      version: collectionItem.version,
      created_at: collectionItem.created_at,
      updated_at: collectionItem.updated_at,
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
