import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('numeric_item_revision', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('type').notNullable();
    table.integer('code').notNullable();
    table.uuid('organizational_resource_plant_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('filePath');
    table.date('expiry_date').notNullable();
    table.string('measurement_unit');
    table.integer('size').notNullable();
    table.integer('precision').notNullable();
    table.boolean('existing_limits').notNullable();
    table.integer('min_limit');
    table.integer('max_limit');
    table.boolean('static_control').notNullable();
    table
      .uuid('collection_item_id')
      .references('id')
      .inTable('collection_item')
      .notNullable();
    table.unique(['collection_item_id', 'version']);
    table.timestamp('created_at');
    table.timestamp('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('numeric_item_revision');
}
