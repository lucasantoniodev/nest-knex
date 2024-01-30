import { Injectable } from '@nestjs/common';
import { TextItemModel } from 'src/api/collection-item/collection-text-item/models/text-item.model';
import { CollectionItemModel } from 'src/api/collection-item/models/collection-item.model';
import { KnexAppRepository } from 'src/knex/knex.repository';
import { CollectionFormRevisionModel } from '../models/collection-form-revision.model';
import { CollectionFormModel, ItemForm } from '../models/collection-form.model';
import { CollectionTextItemRevision } from '../models/collection-text-item-revision.model';
import { Knex } from 'knex';

@Injectable()
export class CollectionFormRepository {
  constructor(private readonly knexRepository: KnexAppRepository) {}

  public async create(
    collectionForm: CollectionFormModel,
    itemsForm: ItemForm[],
  ) {
    return this.knexRepository.executeTransaction(async (trx) => {
      const collectionFormCreated =
        await this.knexRepository.create<CollectionFormModel>({
          trx,
          tableName: 'collection_form',
          entity: collectionForm,
        });

      const itemsFormCreated = await this.knexRepository.create<ItemForm[]>({
        trx,
        tableName: 'item_form',
        entity: itemsForm.map((item) => {
          item.collection_form_id = collectionFormCreated.id;
          return item;
        }),
      });

      const collectionFormRevision =
        await this.knexRepository.create<CollectionFormRevisionModel>({
          trx,
          tableName: 'collection_form_revision',
          entity: this.generateCollectionFormRevision(collectionFormCreated, 0),
        });

      await Promise.all(
        itemsForm.map(async (item) => {
          switch (item.type) {
            case 1:
              return this.generateCollectionTextItemRevision(
                trx,
                item,
                collectionFormRevision,
              );
          }
        }),
      );

      return collectionFormRevision;
    });
  }

  public async update(
    id: string,
    collectionForm: CollectionFormModel,
    itemsForm: ItemForm[],
  ) {
    return this.knexRepository.executeTransaction(async (trx) => {});
  }

  private async generateCollectionTextItemRevision(
    trx: Knex.Transaction,
    item: ItemForm,
    collectionFormRevision: CollectionFormRevisionModel,
  ) {
    const collectionItem = await this.knexRepository.findByIdWithJoin<
      CollectionItemModel & TextItemModel
    >({
      tableName: 'collection_item',
      joinTableName: 'text_item',
      joinColumnName: 'collection_item_id',
      id: item.collection_item_id,
    });
    return await this.knexRepository.create<CollectionTextItemRevision>({
      trx,
      tableName: 'text_item_revision',
      entity: {
        type: collectionItem.type,
        code: collectionItem.code,
        organizational_resource_plant_id: collectionItem.organizational_resource_plant_id,
        title: collectionItem.title,
        description: collectionItem.description,
        filePath: collectionItem.file_path,
        expiry_date: collectionItem.expiry_date,
        max_length: collectionItem.max_length,
        min_length: collectionItem.min_length,
        validate_min_length: collectionItem.validate_min_length,
        collection_item_id: item.collection_item_id,
        collection_form_revision_id: collectionFormRevision.id,
        created_at: collectionItem.created_at,
        updated_at: collectionItem.updated_at,
      },
    });
  }

  private generateCollectionFormRevision(
    collectionForm: CollectionFormModel,
    version: number,
  ): CollectionFormRevisionModel {
    return {
      name: collectionForm.name,
      description: collectionForm.description,
      collection_form_id: collectionForm.id,
      version,
    };
  }
}
