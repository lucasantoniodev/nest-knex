import { Body, Controller, Post } from '@nestjs/common';
import { CreateCollectionFormService } from '../services/createCollectionForm.service';
import { CreateCollectionForm } from '../models/dto/request.model';

@Controller('collection-form')
export class CreateCollectionFormController {
  constructor(private readonly service: CreateCollectionFormService) {}

  @Post()
  public execute(@Body() data: CreateCollectionForm) {
    return this.service.execute(data);
  }
}
