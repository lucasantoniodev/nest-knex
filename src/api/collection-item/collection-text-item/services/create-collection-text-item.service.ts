import { Injectable } from '@nestjs/common';
import { CollectionTextItemConverter } from '../converters/collection-text-item.converter';
import { CreateTextItemModelDto } from '../models/dto/create-text-item.model';
import { CollectionTextItemRepository } from '../repositories/collection-text-item.repository';

@Injectable()
export class CreateCollectionTextItemService {
  constructor(
    private readonly repository: CollectionTextItemRepository,
    private readonly converter: CollectionTextItemConverter,
  ) {}

  public async execute(data: CreateTextItemModelDto) {
    const { collectionItem, textItem } =
      this.converter.convertCreateRequest(data);
    return this.repository.create(collectionItem, textItem);
  }
}
