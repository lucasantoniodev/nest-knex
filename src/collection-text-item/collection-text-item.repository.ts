import { Injectable } from '@nestjs/common';
import { KnexAuditRepository } from 'src/knex/knex-audit.repository';
import {
  CollectionItemModel,
  CollectionTextItemHistoryModel,
  TextItemModel,
} from './collection-text-item.model';

@Injectable()
export class CollectionTextItemRepository {
  constructor(
    private readonly knexAuditRepository: KnexAuditRepository<
      CollectionItemModel,
      CollectionTextItemHistoryModel
    >,
  ) {
    this.knexAuditRepository.setTableName('text_item', 'text_item_history');
  }

  public async create(baseData: CollectionItemModel, childData: TextItemModel) {
    return this.knexAuditRepository.createInheritanceAudit(
      this.generateInheritanceConfig({ baseData, childData }),
    );
  }

  public async update(baseData: CollectionItemModel, childData: TextItemModel) {
    return this.knexAuditRepository.updateInheritanceAudit(
      this.generateInheritanceConfig({ baseData, childData }),
    );
  }

  public async delete(id: string) {
    const config = this.generateInheritanceConfig({});
    config.baseData.data.id = id;
    return this.knexAuditRepository.deleteInheritanceAudit(config);
  }

  private generateInheritanceConfig({
    baseData,
    childData,
  }: {
    baseData?: CollectionItemModel;
    childData?: TextItemModel;
  }) {
    return {
      baseData: {
        tableName: 'collection_item',
        data: baseData,
      },
      childData: {
        tableName: 'text_item',
        data: childData,
      },
      referenceNameRelationId: 'collection_item_id',
      config: {
        hasRename: true,
        baseDataConfig: { oldName: 'id', newName: 'collection_item_id' },
        childDataConfig: { oldName: 'id', newName: 'text_item_id' },
      },
    };
  }
}
