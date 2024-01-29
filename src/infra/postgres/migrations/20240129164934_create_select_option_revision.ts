import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('select_option_revision', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('select_item_revision_id')
      .references('id')
      .inTable('select_item_revision');
    table.string('description').notNullable();
    table.integer('index').notNullable();
    table.boolean('approves').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('select_option_revision');
}
