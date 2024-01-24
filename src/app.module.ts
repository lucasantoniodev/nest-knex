import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KnexModule } from 'nestjs-knex';
import { KnexRepository } from './knex/knex.repository';
import { CollectionItemModule } from './collection-item/collection-item.module';

@Module({
  imports: [CollectionItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
