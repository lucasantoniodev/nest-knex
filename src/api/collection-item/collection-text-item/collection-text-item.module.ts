import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CreateCollectionTextItemController } from './controllers/createCollectionTextItem.controller';
import { UpdateCollectionTextItemController } from './controllers/updateCollectionTextItem.controller';
import { CollectionTextItemRequestConverter } from './converters/collection-text-item.converter';
import { CollectionTextItemRepository } from './repositories/collection-text-item.repository';
import { CreateCollectionTextItemService } from './services/createCollectionTextItem.service';
import { UpdateCollectionTextItemService } from './services/updateCollectionTextItem.service';
import { FindCollectionTextItemByIdController } from './controllers/findCollectionTextItemById.controller';
import { FindCollectionTextItemByIdService } from './services/findCollectionTextItemById.service';

@Module({
  imports: [KnexAppModule],
  controllers: [
    CreateCollectionTextItemController,
    UpdateCollectionTextItemController,
    FindCollectionTextItemByIdController,
  ],
  providers: [
    CollectionTextItemRepository,
    CreateCollectionTextItemService,
    UpdateCollectionTextItemService,
    FindCollectionTextItemByIdService,
    CollectionTextItemRequestConverter,
  ],
})
export class CollectionTextItemModule {}
