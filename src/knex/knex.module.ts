import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { KnexAuditRepository } from './knex-audit.repository';
import { KnexRepository } from './knex.repository';
import { KnexNewRepository } from './knex-new.repository';

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
  providers: [KnexRepository, KnexAuditRepository, KnexNewRepository],
  exports: [KnexRepository, KnexAuditRepository, KnexNewRepository],
})
export class KnexAppModule {}
