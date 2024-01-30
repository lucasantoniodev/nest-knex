import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collection_form_revision', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('description').notNullable();
    table
      .uuid('collection_form_id')
      .references('id')
      .inTable('collection_form')
      .notNullable();
    table.integer('version').notNullable().defaultTo(0);
    table.unique(['collection_form_id', 'version']);
    table.timestamp('created_at');
    table.timestamp('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collection_form_revision');
}
