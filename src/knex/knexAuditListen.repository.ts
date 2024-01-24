import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexAuditListenRepository {
  public client: Knex;
  private tableName: string = '';
  private tableNameHistory: string = `${this.tableName}_history`;

  constructor(knex: Knex) {
    this.client = knex;
  }

  public applyTableNames(tableName: string, tableNameHistory?: string) {
    this.tableName = tableName;
    if (tableNameHistory) this.tableNameHistory = tableNameHistory;
  }

  @OnEvent('audit')
  async handleAudit(data: any) {
    await this.validateIfHasTable();
    await this.client.insert(data).into(this.tableNameHistory);
  }

  private async validateIfHasTable() {
    const hasTable = await this.client.schema.hasTable(this.tableNameHistory);

    if (!hasTable) {
      throw new Error('Tabela de histórico não encontrada...');
    }
  }
}
