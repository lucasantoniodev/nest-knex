import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class KnexNewRepository implements OnModuleDestroy {
  public constructor(@InjectKnex() private readonly knex: Knex) {}

  public onModuleDestroy() {
    if (this.knex) {
      this.knex.destroy();
    }
  }

  public get client() {
    return this.knex;
  }

  public async executeTransaction<T>(
    callback: (trx: Knex.Transaction) => Promise<T>,
  ) {
    let result: T;
    const trx = await this.client.transaction();
    try {
      result = await callback(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
    return result;
  }

  public async create<T>(
    trx: Knex.Transaction,
    tableName: string,
    entity: T,
  ): Promise<T> {
    const record = await trx.table(tableName).insert(entity).returning('*');
    return Array.isArray(entity) ? record : record[0];
  }
}
