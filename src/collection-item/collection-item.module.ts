import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { KnexRepository } from 'src/knex/knex.repository';
import { CollectionItemController } from './collection-item.controller';
import { CollectionItemService } from './collection-item.service';

@Module({
  imports: [KnexAppModule],
  controllers: [CollectionItemController],
  providers: [CollectionItemService, KnexRepository],
})
export class CollectionItemModule {}
