import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CollectionItemController } from './collection-text-item.controller';
import { CollectionTextItemService } from './collection-text-item.service';

@Module({
  imports: [KnexAppModule],
  controllers: [CollectionItemController],
  providers: [CollectionTextItemService],
})
export class CollectionTextItemModule {}
