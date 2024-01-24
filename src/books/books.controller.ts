import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() data: any) {
    return this.booksService.create(data);
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
