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
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('select_item');
}
