import { Injectable } from '@nestjs/common';
import { CollectionFormRepository } from '../repositories/collection-form.repository';
import { CreateCollectionForm } from '../models/dto/request.model';

@Injectable()
export class CreateCollectionFormService {
  constructor(private readonly repository: CollectionFormRepository) {}

  public async execute(data: CreateCollectionForm) {
    return this.repository.create(
      {
        name: data.name,
        description: data.description,
      },
      data.items,
    );
  }
}
