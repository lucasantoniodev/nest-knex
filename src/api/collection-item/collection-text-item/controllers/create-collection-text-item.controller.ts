import { Body, Post } from '@nestjs/common';
import { CreateTextItemModelDto } from '../models/dto/create-text-item.model';
import { CreateCollectionTextItemService } from '../services/create-collection-text-item.service';
import { CollectionTextItem } from './collection-text-item.controller.interface';

export class CreateCollectionTextItemController extends CollectionTextItem {
  constructor(private readonly service: CreateCollectionTextItemService) {
    super();
  }

  @Post()
  public execute(@Body() data: CreateTextItemModelDto) {
    return this.service.execute(data);
  }
}
