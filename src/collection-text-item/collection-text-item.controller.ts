import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CollectionTextItemService } from './collection-text-item.service';
import {
  CollectionItemModel,
  CollectionTextItemUpdateRequestDto,
  CreateCollectionTextItemRequestDto,
} from './collection-text-item.model';

@Controller('collection-text-item')
export class CollectionTextItemController {
  constructor(
    private readonly collectionTextItemService: CollectionTextItemService,
  ) {}

  @Post()
  create(@Body() data: CreateCollectionTextItemRequestDto) {
    return this.collectionTextItemService.create(data);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() data: CollectionTextItemUpdateRequestDto,
  ) {
    return this.collectionTextItemService.update(id, data);
  }

  @Get()
  findAll() {
    return 'findAll() Não implementado';
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return 'findById() Não implementado';
  }

  @Get('/:id/:version')
  findByIdAndVersion(
    @Param('id') id: string,
    @Param('version') version: number,
  ) {
    return 'findByIdAndVersion() Não implementado';
  }

  @Delete('/:id')
  deleteWithAudit(@Param('id') id: string) {
    return this.collectionTextItemService.delete(id);
  }
}
