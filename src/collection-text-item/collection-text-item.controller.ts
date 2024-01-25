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
  createWithTwoEntites(@Body() data: CreateCollectionTextItemRequestDto) {
    return this.collectionTextItemService.create(data);
  }

  @Put('/:id')
  updateWithTwoEntities(
    @Param('id') id: string,
    @Body() data: CollectionTextItemUpdateRequestDto,
  ) {
    return this.collectionTextItemService.updateTwoEntityWithOnceAudit(
      id,
      data,
    );
  }

  @Get()
  findAll() {
    return this.collectionTextItemService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return 'Não implementado';
  }

  @Get('/:id/:version')
  findByIdAndVersion(
    @Param('id') id: string,
    @Param('version') version: number,
  ) {
    return this.collectionTextItemService.findByIdAndVersion(id, version);
  }

  @Delete('/:id')
  deleteWithAudit(@Param('id') id: string) {
    return this.collectionTextItemService.delete(id);
  }
}
