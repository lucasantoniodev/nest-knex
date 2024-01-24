import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BooksService } from './books.service';
import { KnexRepository } from 'src/knex/knex.repository';
import { BooksController } from './books.controller';
import { KnexAppModule } from 'src/knex/knex.module';

@Module({
  imports: [KnexAppModule],
  controllers: [BooksController],
  providers: [BooksService, KnexRepository],
})
export class BooksModule {}
