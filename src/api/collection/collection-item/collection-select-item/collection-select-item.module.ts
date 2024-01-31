import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CollectionSelectItemRepository } from './repositories/collection-select-item.repository';
import { CreateCollectionSelectItemController } from './controllers/createCollectionSelectItem.controller';
import { CreateCollectionSelectItemService } from './services/createCollectionSelectItem.service';
import { CollectionSelectItemRequestConverter } from './converters/request.converter';
import { UpdateCollectionSelectItemController } from './controllers/updateCollectionSelectItem.controller';
import { UpdateCollectionSelectItemService } from './services/updateCollectionSelectItem.service';

@Module({
  imports: [KnexAppModule],
  controllers: [
    CreateCollectionSelectItemController,
    UpdateCollectionSelectItemController,
  ],
  providers: [
    CollectionSelectItemRepository,
    CollectionSelectItemRequestConverter,
    CreateCollectionSelectItemService,
    UpdateCollectionSelectItemService,
  ],
})
export class CollectionSelectItemModule {}
