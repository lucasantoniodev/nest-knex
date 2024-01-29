import { Controller, Get, Param } from '@nestjs/common';
import { FindCollectionTextItemByIdService } from '../services/findCollectionTextItemById.service';

@Controller('collection-text-item')
export class FindCollectionTextItemByIdController {
  constructor(private readonly service: FindCollectionTextItemByIdService) {}

  @Get('/:id')
  public execute(@Param('id') id: string) {
    return this.service.execute(id);
  }
}
