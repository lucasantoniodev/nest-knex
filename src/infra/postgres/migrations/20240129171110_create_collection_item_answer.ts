import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collection_item_answer', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('collection_form_answer_id')
      .references('id')
      .inTable('collection_form_answer')
      .notNullable();
    table.uuid('collection_item_revision_id').notNullable();
    table.string('answer').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collection_item_answer');
}
