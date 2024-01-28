import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CreateCollectionTextItemController } from './controllers/create-collection-text-item.controller';
import { UpdateCollectionTextItemController } from './controllers/update-collection-text-item.controller';
import { CollectionTextItemRequestConverter } from './converters/collection-text-item.converter';
import { CollectionTextItemRepository } from './repositories/collection-text-item.repository';
import { CreateCollectionTextItemService } from './services/create-collection-text-item.service';
import { UpdateCollectionTextItemService } from './services/update-collection-text-item.service';

@Module({
  imports: [KnexAppModule],
  controllers: [
    CreateCollectionTextItemController,
    UpdateCollectionTextItemController,
  ],
  providers: [
    CollectionTextItemRepository,
    CreateCollectionTextItemService,
    UpdateCollectionTextItemService,
    CollectionTextItemRequestConverter,
  ],
})
export class CollectionTextItemModule {}
