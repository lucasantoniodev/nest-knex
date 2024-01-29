import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CreateCollectionTextItemController } from './controllers/createCollectionTextItem.controller';
import { DeleteCollectionTextItemController } from './controllers/deleteCollectionTextItem.controller';
import { FindCollectionTextItemByIdController } from './controllers/findCollectionTextItemById.controller';
import { UpdateCollectionTextItemController } from './controllers/updateCollectionTextItem.controller';
import { CollectionTextItemRequestConverter } from './converters/collection-text-item.converter';
import { CollectionTextItemRepository } from './repositories/collection-text-item.repository';
import { CreateCollectionTextItemService } from './services/createCollectionTextItem.service';
import { DeleteCollectionTextItemService } from './services/deleteCollectionTextItem.service';
import { FindCollectionTextItemByIdService } from './services/findCollectionTextItemById.service';
import { UpdateCollectionTextItemService } from './services/updateCollectionTextItem.service';

@Module({
  imports: [KnexAppModule],
  controllers: [
    CreateCollectionTextItemController,
    UpdateCollectionTextItemController,
    FindCollectionTextItemByIdController,
    DeleteCollectionTextItemController,
  ],
  providers: [
    CollectionTextItemRepository,
    CreateCollectionTextItemService,
    UpdateCollectionTextItemService,
    FindCollectionTextItemByIdService,
    DeleteCollectionTextItemService,
    CollectionTextItemRequestConverter,
  ],
})
export class CollectionTextItemModule {}
