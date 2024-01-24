import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KnexModule } from 'nestjs-knex';
import { KnexRepository } from './knex/knex.repository';
import { CollectionTextItemModule } from './collection-text-item/collection-text-item.module';

@Module({
  imports: [CollectionTextItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
