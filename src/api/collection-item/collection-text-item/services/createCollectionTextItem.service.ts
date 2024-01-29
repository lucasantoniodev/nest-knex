import { Injectable } from '@nestjs/common';
import { CollectionTextItemRequestConverter } from '../converters/collection-text-item.converter';
import { CreateTextItemModelDto } from '../models/dto/request.model';
import { CollectionTextItemRepository } from '../repositories/collection-text-item.repository';

@Injectable()
export class CreateCollectionTextItemService {
  constructor(
    private readonly repository: CollectionTextItemRepository,
    private readonly converter: CollectionTextItemRequestConverter,
  ) {}

  public async execute(data: CreateTextItemModelDto) {
    const { collectionItem, textItem } = this.converter.execute(data);
    return this.repository.create(collectionItem, textItem);
  }
}
