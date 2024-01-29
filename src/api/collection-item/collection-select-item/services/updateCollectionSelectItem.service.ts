import { Injectable } from '@nestjs/common';
import { CollectionSelectItemRequestConverter } from '../converters/request.converter';
import { CreateCollectionSelectItemRequestModelDto } from '../models/dto/request/createCollectionSelectItem.model';
import { CollectionSelectItemRepository } from '../repositories/collection-select-item.repository';

@Injectable()
export class UpdateCollectionSelectItemService {
  constructor(
    private readonly repository: CollectionSelectItemRepository,
    private readonly converter: CollectionSelectItemRequestConverter,
  ) {}

  public async execute(
    id: string,
    data: CreateCollectionSelectItemRequestModelDto,
  ) {
    const { collectionItem, selectOptions } =
      this.converter.convertCreate(data);
    return this.repository.update(id, collectionItem, selectOptions);
  }
}
