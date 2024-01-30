import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('select_item_revision', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('type').notNullable();
    table.integer('code').notNullable();
    table.uuid('organizational_resource_plant_id').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('filePath');
    table.date('expiry_date').notNullable();
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
  await knex.schema.dropTable('select_item_revision');
}
