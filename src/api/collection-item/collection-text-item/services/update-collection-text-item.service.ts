import { Injectable } from '@nestjs/common';
import { CollectionTextItemRequestConverter } from '../converters/collection-text-item.converter';
import { UpdateCollectionTextItemModelDto } from '../models/dto/request.model';
import { CollectionTextItemRepository } from '../repositories/collection-text-item.repository';
import { hasValidData } from 'src/helper/verify-if-has-property.helper';

@Injectable()
export class UpdateCollectionTextItemService {
  constructor(
    private readonly repository: CollectionTextItemRepository,
    private readonly converter: CollectionTextItemRequestConverter,
  ) {}
  public async execute(id: string, data: UpdateCollectionTextItemModelDto) {
    const { collectionItem, textItem } = this.converter.execute(data);
    if (!hasValidData(collectionItem) && !hasValidData(textItem)) {
      return;
    }
    return this.repository.update(id, collectionItem, textItem);
  }
}
