import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateCollectionTextItemService } from '../services/update-collection-text-item.service';
import { UpdateCollectionTextItemModelDto } from '../models/dto/request.model';

@Controller('collection-text-item')
export class UpdateCollectionTextItemController {
  constructor(private readonly service: UpdateCollectionTextItemService) {}

  @Put('/:id')
  public async execute(
    @Param('id') id: string,
    @Body() data: UpdateCollectionTextItemModelDto,
  ) {
    return this.service.execute(id, data);
  }
}
