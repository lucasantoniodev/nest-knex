import { Injectable } from '@nestjs/common';
import { CollectionTextItemRepository } from '../repositories/collection-text-item.repository';

@Injectable()
export class FindCollectionTextItemByIdService {
  constructor(private readonly repository: CollectionTextItemRepository) {}

  public async execute(id: string) {
    return this.repository.findById(id);
  }
}
