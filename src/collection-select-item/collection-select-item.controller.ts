import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  CollectionSelectItemModel,
  CollectionSelectItemUpdateRequestDto,
} from './collection-select-item.model';
import { CollectionSelectItemRepository } from './collection-select-item.repository';

@Controller('collection-select-item')
export class CollectionSelectItemController {
  constructor(private readonly repository: CollectionSelectItemRepository) {}

  @Post()
  create(@Body() data: CollectionSelectItemModel) {
    return this.repository.create(data);
  }

  @Put('/:idCollection/')
  update(
    @Body() data: CollectionSelectItemUpdateRequestDto,
    @Param('idCollection') idCollection: string,
  ) {
    return this.repository.update(idCollection, data);
  }
}
