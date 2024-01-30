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

      const itemsCreated = await this.knexRepository.create<ItemForm[]>({
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
          entity: this.generateCollectionFormRevision(collectionFormCreated),
        });

      return { ...collectionFormRevision, collection_items: itemsCreated };
    });
  }

  private generateCollectionFormRevision(
    collectionForm: CollectionFormModel,
  ): CollectionFormRevisionModel {
    return {
      name: collectionForm.name,
      description: collectionForm.description,
      collection_form_id: collectionForm.id,
      created_at: collectionForm.created_at,
      updated_at: collectionForm.updated_at,
    };
  }
}
