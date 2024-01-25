import { Injectable } from '@nestjs/common';
import {
  CollectionTextItemUpdateRequestDto,
  CreateCollectionTextItemRequestDto
} from './collection-text-item.model';
import { CollectionTextItemRepository } from './collection-text-item.repository';
import { CollectionTextItemConverter } from './converter/collection-text-item.converter';

@Injectable()
export class CollectionTextItemService {
  constructor(
    private readonly repository: CollectionTextItemRepository,
    private readonly converter: CollectionTextItemConverter,
  ) {}

  public async create(data: CreateCollectionTextItemRequestDto) {
    const { baseData, childData } = this.converter.convertCreateRequest(data);
    return this.repository.create(baseData, childData);
  }

  async update(id: string, data: CollectionTextItemUpdateRequestDto) {
    const { baseData, childData } = this.converter.convertUpdateRequest(
      id,
      data,
    );
    return this.repository.update(baseData, childData);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
