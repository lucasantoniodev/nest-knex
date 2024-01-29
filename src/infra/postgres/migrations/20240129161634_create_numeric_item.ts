import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('numeric_item', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .unique()
      .notNullable();
    table.string('measurement_unit');
    table.integer('size').notNullable();
    table.integer('precision').notNullable();
    table.boolean('existing_limits').notNullable();
    table.integer('max_limit');
    table.integer('min_limit');
    table.boolean('static_control').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('numeric_item');
}
