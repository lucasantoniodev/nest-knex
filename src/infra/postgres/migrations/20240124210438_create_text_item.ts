import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('text_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .unique()
      .notNullable();
    table.integer('min_length');
    table.integer('max_length').notNullable();
    table.boolean('validate_min_length').notNullable();
  });

  await knex.schema.createTable('text_item_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('text_item_id').notNullable();
    table.uuid('collection_item_id').notNullable();
    table.integer('type').notNullable();
    table.integer('code').notNullable();
    table.integer('workcenter_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('filePath');
    table.timestamp('expiry_date').notNullable();
    table.integer('min_length');
    table.integer('max_length').notNullable();
    table.boolean('validate_min_length').notNullable();
    table.integer('version').notNullable();
    table.timestamp('created_at');
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
    table.uuid('revision_history_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('text_item');
  await knex.schema.dropTable('text_item_history');
}
