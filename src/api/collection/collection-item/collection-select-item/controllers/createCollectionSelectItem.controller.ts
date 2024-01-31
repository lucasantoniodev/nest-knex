import { Body, Controller, Post } from '@nestjs/common';
import { CreateCollectionSelectItemService } from '../services/createCollectionSelectItem.service';
import { CreateCollectionSelectItemRequestModelDto } from '../models/dto/request/createCollectionSelectItem.model';

@Controller('collection-select-item')
export class CreateCollectionSelectItemController {
  constructor(private readonly service: CreateCollectionSelectItemService) {}

  @Post()
  public execute(@Body() data: CreateCollectionSelectItemRequestModelDto) {
    return this.service.execute(data);
  }
}
