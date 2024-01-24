import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { KnexRepository } from 'src/knex/knex.repository';
import { CollectionItemController } from './collection-text-item.controller';
import { CollectionTextItemService } from './collection-text-item.service';

@Module({
  imports: [KnexAppModule],
  controllers: [CollectionItemController],
  providers: [CollectionTextItemService, KnexRepository],
})
export class CollectionTextItemModule {}
