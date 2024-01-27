import { Body, Controller, Post } from '@nestjs/common';
import { CreateTextItemModelDto } from '../models/dto/create-text-item.model';
import { CreateCollectionTextItemService } from '../services/create-collection-text-item.service';

@Controller('collection-text-item')
export class CreateCollectionTextItemController {
  constructor(private readonly service: CreateCollectionTextItemService) {}

  @Post()
  public execute(@Body() data: CreateTextItemModelDto) {
    return this.service.execute(data);
  }
}
