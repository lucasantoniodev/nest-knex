import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('item_form', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .notNullable();
    table
      .uuid('collection_form_id')
      .references('id')
      .inTable('item_form')
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('item_form');
}
