import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('books', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.integer('version').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
  // TRIGGER para auto incrementar a versão da entidade
  await knex.raw(`
  CREATE OR REPLACE FUNCTION increment_version()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.version = OLD.version + 1;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER books_increment_version
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();
`);
  await knex.schema.createTable('books_history', (table) => {
    table
      .uuid('id_history')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.integer('version').notNullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').notNullable();
    table.timestamp('deleted_at');
    table.timestamp('created_history_at').defaultTo(knex.fn.now());
    table.timestamp('updated_history_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_history_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('books');
  await knex.raw(`
  DROP TRIGGER IF EXISTS books_increment_version ON books;
  DROP FUNCTION IF EXISTS increment_version();
`);
  await knex.schema.dropTable('books_history');
}
