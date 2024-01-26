import { Body, Controller, Post } from '@nestjs/common';
import { CollectionSelectItemModel } from './collection-select-item.model';
import { CollectionSelectItemRepository } from './collection-select-item.repository';

@Controller('collection-select-item')
export class CollectionSelectItemController {
  constructor(private readonly repository: CollectionSelectItemRepository) {}

  @Post()
  create(@Body() data: CollectionSelectItemModel) {
    return this.repository.create(data);
  }
}
