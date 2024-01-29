import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteCollectionTextItemService } from '../services/deleteCollectionTextItem.service';

@Controller('collection-text-item')
export class DeleteCollectionTextItemController {
  constructor(private readonly service: DeleteCollectionTextItemService) {}

  @Delete('/:id')
  public execute(@Param('id') id: string) {
    return this.service.execute(id);
  }
}
