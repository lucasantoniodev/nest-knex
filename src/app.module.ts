import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { KnexRepository } from './knex/knex.repository';
import { BooksModule } from './books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
