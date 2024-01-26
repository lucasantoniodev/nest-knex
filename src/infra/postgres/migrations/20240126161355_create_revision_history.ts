import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('revision_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('revision_history');
}
