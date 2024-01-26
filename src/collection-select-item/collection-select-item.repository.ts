import { Injectable } from '@nestjs/common';
import { CollectionItemModel } from 'src/collection-text-item/collection-text-item.model';
import { KnexAuditRepository } from 'src/knex/knex-audit.repository';
import {
  CollectionSelectItemHistoryModel,
  CollectionSelectItemModel,
  CollectionSelectItemUpdateRequestDto,
  CollectionSelectOption,
  CollectionSelectOptionUpdateRequestDto,
} from './collection-select-item.model';
import { CollectionSelectItemConverter } from './collection-select-item.converter';

@Injectable()
export class CollectionSelectItemRepository {
  constructor(
    private readonly knexAuditRepository: KnexAuditRepository<
      any,
      CollectionSelectItemHistoryModel
    >,
    private readonly converter: CollectionSelectItemConverter,
  ) {}

  public async create(data: CollectionSelectItemModel) {
    const baseData = this.converter.convertCreatRequest(data);
    return this.knexAuditRepository.createManyInheritanceAudit(
      this.generateInheritanceConfig({
        baseData,
        childData: {},
        grandChildData: data.options,
      }),
    );
  }

  public async update(
    idCollection: string,
    data: CollectionSelectItemUpdateRequestDto,
  ) {
    const { baseData, grandChildData } = this.converter.convertUpdateRequest(
      idCollection,
      data,
    );

    return await this.knexAuditRepository.updateManyInheritanceAudit(
      this.generateInheritanceConfig({
        baseData,
        childData: {},
        grandChildData,
      }),
    );
  }

  private generateInheritanceConfig({
    baseData,
    childData,
    grandChildData,
  }: {
    baseData?: CollectionItemModel;
    childData?: {};
    grandChildData:
      | CollectionSelectOption[]
      | CollectionSelectOptionUpdateRequestDto[];
  }) {
    return {
      baseData: {
        tableName: 'collection_item',
        tableNameHistory: 'collection_item_history',
        data: baseData,
      },
      childData: {
        tableName: 'select_item',
        tableNameHistory: 'select_item_history',
        data: childData,
      },
      grandChildData: {
        tableName: 'select_option',
        tableNameHistory: 'select_option_history',
        data: grandChildData,
      },
      referenceNameRelationId: 'collection_item_id',
      referenceNameRelationGrandChildId: 'select_item_id',
      config: {
        hasRename: true,
        baseDataConfig: { oldName: 'id', newName: 'collection_item_id' },
        childDataConfig: { oldName: 'id', newName: 'select_item_id' },
        grandChildDataConfig: { oldName: 'id', newName: 'select_option_id' },
      },
    };
  }
}
