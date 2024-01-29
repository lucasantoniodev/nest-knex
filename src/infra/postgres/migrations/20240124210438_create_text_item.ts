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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('text_item');
}
