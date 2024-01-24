import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';

@Module({
  imports: [
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
})
export class KnexAppModule {}
