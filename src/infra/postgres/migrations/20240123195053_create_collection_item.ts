import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collection_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('type').notNullable();
    table.integer('code').notNullable();
    table.integer('workcenter_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('filePath');
    table.date('expiry_date').notNullable();
    table.integer('version').unique().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
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
  CREATE TRIGGER collection_item_increment_version_update
  BEFORE UPDATE ON collection_item
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collection_item');
  await knex.raw(`
  DROP TRIGGER IF EXISTS collection_item_increment_version_update ON collection_item;
  DROP FUNCTION IF EXISTS increment_version();
`);
}
