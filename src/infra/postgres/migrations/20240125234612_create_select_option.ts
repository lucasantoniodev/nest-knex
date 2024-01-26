import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('select_option', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('select_item_id')
      .references('id')
      .inTable('select_item')
      .notNullable();
    table.string('description').notNullable();
    table.integer('index').notNullable();
    table.boolean('approves').notNullable();
  });

  await knex.schema.createTable('select_option_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('select_item_id').notNullable();
    table.string('description').notNullable();
    table.integer('index').notNullable();
    table.boolean('approves').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('select_option');
  await knex.schema.dropTable('select_option_history');
}
