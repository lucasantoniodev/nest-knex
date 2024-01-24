import { Injectable } from '@nestjs/common';
import { KnexRepository } from 'src/knex/knex.repository';
import { CollectionTextItem } from './collection-item.model';

@Injectable()
export class CollectionItemService {
  constructor(
    private readonly knexRepository: KnexRepository<CollectionTextItem>,
  ) {
    this.knexRepository.setTableName('text_item', 'text_item_history');
  }

  async create(data: any) {
    return this.knexRepository.createWithAudit(data);
  }

  async createTwoEntityWithOnceAudit(data: CollectionTextItem) {
    return this.knexRepository.createTwoRelationWithOnceAudit(
      {
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
      {
        tableName: 'text_item',
        data: data.item,
      },
      {
        nameToRelation: 'collection_item_id',
        renameProps: true,
        firstDataConfig: {
          oldName: 'id',
          newName: 'collection_item_id',
        },
        secondDataConfig: {
          oldName: 'id',
          newName: 'text_item_id',
        },
      },
    );
  }

  async update(id: string, data: any) {
    return this.knexRepository.updateWithAudit(id, data);
  }

  async findAll() {
    return this.knexRepository.findAll();
  }

  async findById(id: string) {
    return this.knexRepository.findById(id);
  }

  async findByIdAndVersion(id: string, version: number) {
    return this.knexRepository.findByIdAndVersion(id, version);
  }

  async delete(id: string) {
    return this.knexRepository.deleteWithAudit(id);
  }
}
