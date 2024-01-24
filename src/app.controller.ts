import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('books')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() data: any) {
    return this.appService.create(data);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.appService.findById(id);
  }

  @Get('/:id/:version')
  findByIdAndVersion(
    @Param('id') id: string,
    @Param('version') version: number,
  ) {
    return this.appService.findByIdAndVersion(id, version);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.appService.update(id, data);
  }

  @Delete('/:id')
  deleteWithAudit(@Param('id') id: string) {
    return this.appService.delete(id);
  }
}
