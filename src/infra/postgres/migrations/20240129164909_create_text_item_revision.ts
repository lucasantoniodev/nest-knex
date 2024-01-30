import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('text_item_revision', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('type').notNullable();
    table.integer('code').notNullable();
    table.uuid('organizational_resource_plant_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('file_path');
    table.date('expiry_date').notNullable();
    table.integer('min_length');
    table.integer('max_length').notNullable();
    table.boolean('validate_min_length').notNullable();
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .notNullable();
    table.integer('version').notNullable();
    table.unique(['collection_item_id', 'version']);
    table.timestamp('created_at');
    table.timestamp('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('text_item_revision');
}
