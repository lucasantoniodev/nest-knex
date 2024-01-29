import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CollectionSelectItemRepository } from './repositories/collection-select-item.repository';
import { CreateCollectionSelectItemController } from './controllers/createCollectionSelectItem.controller';
import { CreateCollectionSelectItemService } from './services/createCollectionSelectItem.service';
import { CollectionSelectItemRequestConverter } from './converters/request.converter';

@Module({
  imports: [KnexAppModule],
  controllers: [CreateCollectionSelectItemController],
  providers: [
    CollectionSelectItemRepository,
    CollectionSelectItemRequestConverter,
    CreateCollectionSelectItemService,
  ],
})
export class CollectionSelectItemModule {}
