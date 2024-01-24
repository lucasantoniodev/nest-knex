import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { KnexRepository } from 'src/knex/knex.repository';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [KnexAppModule],
  controllers: [BooksController],
  providers: [BooksService, KnexRepository],
})
export class BooksModule {}
