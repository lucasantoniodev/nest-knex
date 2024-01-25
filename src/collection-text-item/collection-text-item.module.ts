import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CollectionTextItemController } from './collection-text-item.controller';
import { CollectionTextItemService } from './collection-text-item.service';
import { CollectionTextItemRepository } from './collection-text-item.repository';
import { CollectionTextItemConverter } from './converter/collection-text-item.converter';

@Module({
  imports: [KnexAppModule],
  controllers: [CollectionTextItemController],
  providers: [
    CollectionTextItemRepository,
    CollectionTextItemService,
    CollectionTextItemConverter,
  ],
})
export class CollectionTextItemModule {}
