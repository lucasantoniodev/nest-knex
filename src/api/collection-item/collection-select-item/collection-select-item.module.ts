import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CollectionSelectItemRepository } from './collection-select-item.repository';
import { CollectionSelectItemController } from './collection-select-item.controller';
import { CollectionSelectItemConverter } from './collection-select-item.converter';

@Module({
  imports: [KnexAppModule],
  controllers: [CollectionSelectItemController],
  providers: [CollectionSelectItemRepository, CollectionSelectItemConverter],
})
export class CollectionSelectItemModule {}
