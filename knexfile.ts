import type { Knex } from 'knex';

export const config: { [key: string]: Knex.Config } = {
  development: {
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

  production: {
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
};

module.exports = config;
