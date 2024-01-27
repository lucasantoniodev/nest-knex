import { Module } from '@nestjs/common';
import { CreateCollectionTextItemController } from './controllers/create-collection-text-item.controller';
import { CollectionTextItemRepository } from './repositories/collection-text-item.repository';
import { CreateCollectionTextItemService } from './services/create-collection-text-item.service';
import { CollectionTextItemConverter } from './converters/collection-text-item.converter';
import { KnexAppModule } from 'src/knex/knex.module';

@Module({
  imports: [KnexAppModule],
  controllers: [CreateCollectionTextItemController],
  providers: [
    CollectionTextItemRepository,
    CreateCollectionTextItemService,
    CollectionTextItemConverter,
  ],
})
export class CollectionTextItemModule {}
