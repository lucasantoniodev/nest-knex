import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collection_form', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.integer('version').notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
  CREATE OR REPLACE FUNCTION increment_version()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.version = OLD.version + 1;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER collection_form_increment_version
  BEFORE UPDATE ON collection_form
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collection_form');
  await knex.raw(`
  DROP TRIGGER IF EXISTS collection_form_increment_version ON collection_form;
  DROP FUNCTION IF EXISTS increment_version();
`);
}
