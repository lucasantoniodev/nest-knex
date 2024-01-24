import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.create();
  }

  @Get('/:id')
  update(@Param('id') id: string) {
    return this.appService.update(id);
  }
}
