import { Injectable } from '@nestjs/common';
import { CollectionTextItemRepository } from '../repositories/collection-text-item.repository';

@Injectable()
export class DeleteCollectionTextItemService {
  constructor(private readonly reposity: CollectionTextItemRepository) {}

  public async execute(id: string) {
    const entity = await this.reposity.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} does not exists`);
    }

    return this.reposity.delete(id);
  }
}
