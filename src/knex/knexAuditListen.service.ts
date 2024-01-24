import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexAuditListenService {
  public client: Knex;
  private tableName: string;
  private entity: any;

  constructor(knex: Knex) {
    this.client = knex;
  }

  @OnEvent('startAudit')
  async handleOnStartAudit(id: string | number, tableName: string) {
    console.log('Iniciando serviço de auditoria, capturando dados...');
    this.tableName = tableName;
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
    const tableHistoryName = `${this.tableName}_history`;
    const hasTable = await this.client.schema.hasTable(tableHistoryName);

    if (!hasTable) {
      throw new Error('Table does not exist');
    }

    if (this.entity) {
      await this.client.insert(this.entity).into(tableHistoryName);
    }

    console.log('Auditoria finalizada com sucesso para o item' + this.entity);
  }
}
