import { Injectable } from '@nestjs/common';
import { KnexNewRepository } from 'src/knex/knex-new.repository';
import { CollectionItemModel } from '../../models/collection-item.model';
import { TextItemModel } from '../models/text-item.model';
import { RevisionModel } from 'src/models/revision.model';
import { TextItemHistory } from '../models/text-item-history.model';
import { deleteProperty, renameIdProperty } from 'src/helper';

@Injectable()
export class CollectionTextItemRepository {
  constructor(private readonly knexRepository: KnexNewRepository) {}

  public async create(
    collectionItemEntity: CollectionItemModel,
    textItemEntity: TextItemModel,
  ) {
    return await this.knexRepository.executeTransaction(async (trx) => {
      const baseEntityCreated =
        await this.knexRepository.create<CollectionItemModel>(
          trx,
          'collection_item',
          collectionItemEntity,
        );
      const childEntityCreated =
        await this.knexRepository.create<TextItemModel>(
          trx,
          'text_item',
          this.applyIdRelationAndReturnEntity(
            baseEntityCreated.id,
            textItemEntity,
          ),
        );
      const revisionCreated = await this.knexRepository.create<RevisionModel>(
        trx,
        'revision_history',
        { user: 'Administrador' },
      );
      return await this.knexRepository.create<TextItemHistory>(
        trx,
        'text_item_history',
        this.generateHistoryEntity(
          baseEntityCreated,
          childEntityCreated,
          revisionCreated,
        ),
      );
    });
  }

  private generateHistoryEntity(
    baseEntityCreated: CollectionItemModel,
    childEntityCreated: TextItemModel,
    revisionCreated: RevisionModel,
  ): TextItemHistory {
    renameIdProperty(baseEntityCreated, 'collection_item_id');
    renameIdProperty(childEntityCreated, 'text_item_id');
    renameIdProperty(revisionCreated, 'revision_history_id');
    deleteProperty(revisionCreated, 'user');
    return { ...baseEntityCreated, ...childEntityCreated, ...revisionCreated };
  }

  private applyIdRelationAndReturnEntity(
    id: string,
    textItemEntity: TextItemModel,
  ) {
    textItemEntity.collection_item_id = id;
    return textItemEntity;
  }
}
