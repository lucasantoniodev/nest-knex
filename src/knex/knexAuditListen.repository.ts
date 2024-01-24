import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexAuditListenRepository {
  public client: Knex;
  private tableName: string;
  private tableNameHistory: string;
  private entity: any;

  constructor(knex: Knex) {
    this.client = knex;
  }

  @OnEvent('startAudit')
  async handleOnStartAudit(id: string | number, tableName: string) {
    console.log('Iniciando serviço de auditoria para item com id: ' + id);
    this.applyTableNames(tableName);
    await this.validateIfHasTable();
    this.entity = await this.client
      .select('*')
      .from(this.tableName)
      .where('id', id)
      .first();

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

    this.tableName = null;
    this.entity = null;
    console.log(
      'Auditoria finalizada com sucesso para o item com id: ' + this.entity?.id,
    );
  }

  private applyTableNames(tableName: string) {
    this.tableName = tableName;
    this.tableNameHistory = `${tableName}_history`;
  }

  private async validateIfHasTable() {
    const hasTable = await this.client.schema.hasTable(this.tableNameHistory);

    if (!hasTable) {
      throw new Error('Table does not exist');
    }
  }
}
