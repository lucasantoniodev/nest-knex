import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('select_option', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('select_item_id')
      .references('id')
      .inTable('select_item')
      .notNullable();
    table.string('description').notNullable();
    table.integer('index').notNullable();
    table.boolean('approves').notNullable();
    table.integer('version').unique().defaultTo(0);
  });

  await knex.raw(`
  CREATE OR REPLACE FUNCTION increment_version()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.version = OLD.version + 1;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  -- Trigger para UPDATE
  CREATE TRIGGER select_option_increment_version_update
  BEFORE UPDATE ON select_option
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();  
`);

  await knex.schema.createTable('select_option_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('select_item_id').notNullable();
    table.string('select_option_id').notNullable();
    table.string('description').notNullable();
    table.integer('index').notNullable();
    table.boolean('approves').notNullable();
    table.integer('version').notNullable();
    table.unique(['select_option_id', 'version']);
    table.uuid('revision_history_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('select_option');
  await knex.raw(`
  DROP TRIGGER IF EXISTS select_option_increment_version_update ON select_option;
  DROP FUNCTION IF EXISTS increment_version();
`);
  await knex.schema.dropTable('select_option_history');
}
