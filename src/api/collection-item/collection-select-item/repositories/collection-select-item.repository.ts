import { Injectable } from '@nestjs/common';
import { deleteProperty, renameIdProperty } from 'src/helper';
import { KnexNewRepository } from 'src/knex/knex-new.repository';
import { RevisionModel } from 'src/models/revision.model';
import { CollectionItemModel } from '../../models/collection-item.model';
import {
  SelectItemModel,
  SelectItemModelHistoryModel,
  SelectOptionHistoryModel,
  SelectOptionModel,
} from '../models/collection-select-item.model';

@Injectable()
export class CollectionSelectItemRepository {
  constructor(private readonly knexRepository: KnexNewRepository) {}

  public async create(
    collectionItemEntity: CollectionItemModel,
    selectOptions: SelectOptionModel[],
  ) {
    return this.knexRepository.executeTransaction(async (trx) => {
      const collectionItemCreated =
        await this.knexRepository.create<CollectionItemModel>({
          trx,
          tableName: 'collection_item',
          entity: collectionItemEntity,
        });
      const selectItemCreated =
        await this.knexRepository.create<SelectItemModel>({
          trx,
          tableName: 'select_item',
          entity: { collection_item_id: collectionItemCreated.id },
        });
      const selectOptionsCreated = await this.knexRepository.create<
        SelectOptionModel[]
      >({
        trx,
        tableName: 'select_option',
        entity: this.applyIdRelationsAndReturnEntities(
          selectItemCreated.id,
          selectOptions,
        ),
      });
      const revisionCreated = await this.knexRepository.create<RevisionModel>({
        trx,
        tableName: 'revision_history',
        entity: { user: 'Administrador' },
      });

      await this.knexRepository.create<SelectOptionHistoryModel[]>({
        trx,
        tableName: 'select_option_history',
        entity: selectOptionsCreated.map((option) =>
          this.generateSelectOptionsHistoryEntity(
            selectItemCreated,
            option,
            revisionCreated,
          ),
        ),
      });

      return await this.knexRepository.create<SelectItemModelHistoryModel>({
        trx,
        tableName: 'select_item_history',
        entity: this.generateSelectItemHistoryEntity(
          collectionItemCreated,
          selectItemCreated,
          revisionCreated,
        ),
      });
    });
  }

  private generateSelectItemHistoryEntity(
    collectionItemCreated: CollectionItemModel,
    selectItemCreated: SelectItemModel,
    revisionCreated: RevisionModel,
  ): SelectItemModelHistoryModel {
    return {
      select_item_id: selectItemCreated.id,
      collection_item_id: collectionItemCreated.id,
      type: collectionItemCreated.type,
      code: collectionItemCreated.code,
      workcenter_id: collectionItemCreated.workcenter_id,
      title: collectionItemCreated.title,
      description: collectionItemCreated.description,
      filePath: collectionItemCreated.filePath,
      expiry_date: collectionItemCreated.expiry_date,
      version: collectionItemCreated.version,
      created_at: collectionItemCreated.created_at,
      updated_at: collectionItemCreated.updated_at,
      deleted_at: collectionItemCreated.deleted_at,
      revision_history_id: revisionCreated.id,
    };
  }

  private generateSelectOptionsHistoryEntity(
    selectItemCreated: SelectItemModel,
    selectOptionCreated: SelectOptionModel,
    revisionCreated: RevisionModel,
  ): SelectOptionHistoryModel {
    return {
      select_item_id: selectItemCreated.id,
      select_option_id: selectOptionCreated.id,
      description: selectOptionCreated.description,
      index: selectOptionCreated.index,
      approves: selectOptionCreated.approves,
      version: selectOptionCreated.version,
      revision_history_id: revisionCreated.id,
    };
  }

  private applyIdRelationsAndReturnEntities(
    id: string,
    selectOptions: SelectOptionModel[],
  ) {
    return selectOptions.map((option) => {
      option.select_item_id = id;
      return option;
    });
  }
}
