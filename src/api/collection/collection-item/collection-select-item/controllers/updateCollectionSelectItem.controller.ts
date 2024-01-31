import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateCollectionSelectItemService } from '../services/updateCollectionSelectItem.service';
import { CreateCollectionSelectItemRequestModelDto } from '../models/dto/request/createCollectionSelectItem.model';

@Controller('collection-select-item')
export class UpdateCollectionSelectItemController {
  constructor(private readonly service: UpdateCollectionSelectItemService) {}

  @Put('/:id')
  public execute(
    @Param('id') id: string,
    @Body() data: CreateCollectionSelectItemRequestModelDto,
  ) {
    return this.service.execute(id, data);
  }
}
