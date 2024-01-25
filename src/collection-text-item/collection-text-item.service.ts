import { Injectable } from '@nestjs/common';
import { KnexAuditRepository } from 'src/knex/knex-audit.repository';
import {
  CollectionTextItemEntity,
  CollectionTextItemUpdateRequestDto,
} from './collection-text-item.model';

@Injectable()
export class CollectionTextItemService {
  constructor(
    private readonly knexAuditRepository: KnexAuditRepository<
      CollectionTextItemEntity,
      void
    >,
  ) {
    this.knexAuditRepository.setTableName('text_item', 'text_item_history');
  }

  async create(data: any) {
    return this.knexAuditRepository.createSimpleAudit(data);
  }

  async createTwoEntityWithOnceAudit(data: CollectionTextItemEntity) {
    return this.knexAuditRepository.createInheritanceAudit({
      baseData: {
        tableName: 'collection_item',
        data: {
          type: data.type,
          code: data.code,
          workcenter_id: data.workcenter_id,
          title: data.title,
          description: data.description,
          filePath: data.filePath,
          expiry_date: data.expiry_date,
        },
      },
      childData: {
        tableName: 'text_item',
        data: data.item,
      },
      referenceNameRelationId: 'collection_item_id',
      config: {
        renameProps: true,
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
        renameProps: true,
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
        renameProps: true,
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
