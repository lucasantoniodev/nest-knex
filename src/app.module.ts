import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexService } from './knex/knex.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'postgresql',
          connection: {
            database: 'book_db',
            user: 'postgres',
            password: 'postgres',
          },
          pool: {
            min: 2,
            max: 10,
          },
          migrations: {
            tableName: 'knex_migrations',
            directory: './src/infra/postgres/migrations',
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KnexService],
})
export class AppModule {}
