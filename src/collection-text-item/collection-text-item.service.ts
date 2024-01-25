import { Injectable } from '@nestjs/common';
import { KnexAuditRepository } from 'src/knex/knex-audit.repository';
import {
  CollectionItemModel,
  CollectionTextItemUpdateRequestDto,
  CreateCollectionTextItemRequestDto,
} from './collection-text-item.model';
import { CollectionTextItemRepository } from './collection-text-item.repository';
import { CollectionTextItemConverter } from './converter/collection-text-item.converter';

@Injectable()
export class CollectionTextItemService {
  constructor(
    private readonly knexAuditRepository: KnexAuditRepository<
      CollectionItemModel,
      void
    >,
    private readonly repository: CollectionTextItemRepository,
    private readonly converter: CollectionTextItemConverter,
  ) {
    this.knexAuditRepository.setTableName('text_item', 'text_item_history');
  }

  public async create(data: CreateCollectionTextItemRequestDto) {
    const { baseData, childData } = this.converter.convertCreateRequest(data);
    return this.repository.create(baseData, childData);
  }

  async updateTwoEntityWithOnceAudit(
    id: string,
    data: CollectionTextItemUpdateRequestDto,
  ) {
    return this.knexAuditRepository.updateInheritanceAudit({
      baseData: {
        tableName: 'collection_item',
        data: {
          id: id,
          type: data?.type,
          code: data?.code,
          workcenter_id: data?.workcenter_id,
          title: data?.title,
          description: data?.description,
          filePath: data?.filePath,
          expiry_date: data?.expiry_date,
        },
      },
      childData: {
        tableName: 'text_item',
        data: {
          id: data?.item?.id,
          collection_item_id: id,
          min_length: data?.item?.min_length,
          max_length: data?.item?.max_length,
          validate_min_length: data?.item?.validate_min_length,
        },
      },
      referenceNameRelationId: 'collection_item_id',
      config: {
        hasRename: true,
        baseDataConfig: {
          oldName: 'id',
          newName: 'collection_item_id',
        },
        childDataConfig: {
          oldName: 'id',
          newName: 'text_item_id',
        },
      },
    });
  }

  async delete(id: string) {
    return this.knexAuditRepository.deleteInheritanceAudit({
      baseData: {
        tableName: 'collection_item',
        data: {
          id: id,
        },
      },
      childData: {
        tableName: 'text_item',
        data: {
          collection_item_id: id,
        },
      },
      referenceNameRelationId: 'collection_item_id',
      config: {
        hasRename: true,
        baseDataConfig: {
          oldName: 'id',
          newName: 'collection_item_id',
        },
        childDataConfig: {
          oldName: 'id',
          newName: 'text_item_id',
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.knexAuditRepository.updateSimpleAudit(id, data);
  }

  async findAll() {
    return this.knexAuditRepository.findAll();
  }

  async findByIdAndVersion(id: string, version: number) {
    return this.knexAuditRepository.findAuditByIdAndVersion({
      columnName: 'collection_item_id',
      id,
      version,
    });
  }
}
