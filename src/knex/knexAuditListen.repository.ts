import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexAuditListenRepository {
  public client: Knex;
  private tableName: string = '';
  private tableNameHistory: string = `${this.tableName}_history`;
  private entity: any;

  constructor(knex: Knex) {
    this.client = knex;
  }

  public applyTableNames(tableName: string, tableNameHistory?: string) {
    this.tableName = tableName;
    if (tableNameHistory) this.tableNameHistory = tableNameHistory;
  }

  @OnEvent('startAudit')
  async handleOnStartAudit(data: any) {
    console.log('Iniciando serviço de auditoria para item com id: ' + data?.id);
    await this.validateIfHasTable();
    this.entity = data;

    if (!this.entity) {
      throw new Error('Entity does not exists');
    }
  }

  @OnEvent('finishAudit')
  async handleOnFinishAudit() {
    await this.validateIfHasTable();
    if (this.entity) {
      await this.client.insert(this.entity).into(this.tableNameHistory);
    }

    console.log(
      'Auditoria finalizada com sucesso para o item com id: ' + this.entity?.id,
    );

    this.entity = null;
  }

  private async validateIfHasTable() {
    const hasTable = await this.client.schema.hasTable(this.tableNameHistory);

    if (!hasTable) {
      throw new Error('Table does not exist');
    }
  }
}
