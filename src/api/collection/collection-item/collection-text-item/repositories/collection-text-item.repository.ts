import { Injectable } from '@nestjs/common';
import { KnexAppRepository } from 'src/knex/knex.repository';
import { CollectionItemModel } from '../../models/collection-item.model';
import { TextItemRevision } from '../models/text-item-history.model';
import { TextItemModel } from '../models/text-item.model';
import {
  CollectionFormModel,
  ItemForm,
} from 'src/api/collection/collection-form/models/collection-form.model';
import { CollectionFormRevisionModel } from 'src/api/collection/collection-form/models/collection-form-revision.model';

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
      const collectionItemUpdated =
        await this.knexRepository.update<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: collectionItemEntity,
          id,
        });

      const textItemUpdated = await this.knexRepository.update<TextItemModel>({
        trx,
        tableName: 'text_item',
        columnNameId: 'collection_item_id',
        entity: textItemEntity,
        id,
      });

      const textItemRevisionCreated =
        await this.knexRepository.create<TextItemRevision>({
          trx,
          tableName: 'text_item_revision',
          entity: this.generateTextItemRevision(
            collectionItemUpdated,
            textItemUpdated,
          ),
        });

      const idItemsFormFinded = this.getDistinctCollectionFormIds(
        await this.knexRepository.findMany<ItemForm[]>({
          tableName: 'item_form',
          columnNameId: 'collection_item_id',
          id,
        }),
      );

      await Promise.all(
        idItemsFormFinded.map(async (idItemForm) => {
          const collectionFormUpdated =
            await this.knexRepository.update<CollectionFormModel>({
              trx,
              tableName: 'collection_form',
              id: idItemForm,
              entity: {
                description: undefined,
                updated_at: new Date(),
              },
            });
          await this.knexRepository.create<CollectionFormRevisionModel>({
            trx,
            tableName: 'collection_form_revision',
            entity: this.generateCollectionFormRevision(collectionFormUpdated),
          });
        }),
      );

      return textItemRevisionCreated;
    });
  }

  private getDistinctCollectionFormIds(itemsForm: ItemForm[]): string[] {
    const uniqueCollectionFormIds = new Set<string>();
    itemsForm.forEach((item) => {
      uniqueCollectionFormIds.add(item.collection_form_id);
    });
    return Array.from(uniqueCollectionFormIds);
  }

  private generateCollectionFormRevision(
    collectionForm: CollectionFormModel,
  ): CollectionFormRevisionModel {
    return {
      name: collectionForm.name,
      description: collectionForm.description,
      collection_form_id: collectionForm.id,
      version: collectionForm.version,
      created_at: collectionForm.created_at,
      updated_at: collectionForm.updated_at,
    };
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
