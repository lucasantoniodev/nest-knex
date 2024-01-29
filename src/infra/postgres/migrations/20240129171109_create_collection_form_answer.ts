import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collection_form_answer', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('user').notNullable();
    table
      .uuid('collection_form_revision_id')
      .references('id')
      .inTable('collection_form_revision')
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collection_form_answer');
}
