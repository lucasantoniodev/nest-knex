import { Injectable } from '@nestjs/common';
import { CollectionSelectItemRepository } from '../repositories/collection-select-item.repository';
import { CreateCollectionSelectItemRequestModelDto } from '../models/dto/request/createCollectionSelectItem.model';
import { CollectionSelectItemRequestConverter } from '../converters/request.converter';

@Injectable()
export class CreateCollectionSelectItemService {
  constructor(
    private readonly repository: CollectionSelectItemRepository,
    private readonly converter: CollectionSelectItemRequestConverter,
  ) {}

  public async execute(data: CreateCollectionSelectItemRequestModelDto) {
    const { collectionItem, selectOptions } =
      this.converter.convertCreate(data);
    return this.repository.create(collectionItem, selectOptions);
  }
}
