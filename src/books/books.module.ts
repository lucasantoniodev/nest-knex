import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { KnexRepository } from 'src/knex/knex.repository';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [BooksController],
  providers: [BooksService, KnexRepository],
})
export class BooksModule {}
