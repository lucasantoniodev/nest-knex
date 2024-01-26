import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('select_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .unique()
      .notNullable();
  });

  await knex.schema.createTable('select_item_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('select_item_id').notNullable();
    table.uuid('collection_item_id').notNullable();
    table.integer('type').notNullable();
    table.integer('code').notNullable();
    table.integer('workcenter_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('filePath');
    table.timestamp('expiry_date').notNullable();
    table.integer('version').notNullable();
    table.uuid('revision_history_id').notNullable();
    table.timestamp('created_at');
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('select_item');
  await knex.schema.dropTable('select_item_history');
}
