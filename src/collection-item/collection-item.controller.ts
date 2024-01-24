import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CollectionItemService } from './collection-item.service';
import { CollectionTextItem } from './collection-item.model';

@Controller('collection-item')
export class CollectionItemController {
  constructor(private readonly booksService: CollectionItemService) {}

  @Post()
  create(@Body() data: any) {
    return this.booksService.create(data);
  }

  @Post('/v2')
  createWithTwoEntites(@Body() data: CollectionTextItem) {
    return this.booksService.createTwoEntityWithOnceAudit(data);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.booksService.findById(id);
  }

  @Get('/:id/:version')
  findByIdAndVersion(
    @Param('id') id: string,
    @Param('version') version: number,
  ) {
    return this.booksService.findByIdAndVersion(id, version);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.booksService.update(id, data);
  }

  @Delete('/:id')
  deleteWithAudit(@Param('id') id: string) {
    return this.booksService.delete(id);
  }
}
