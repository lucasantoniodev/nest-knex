import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { KnexAuditListenService } from './knexAuditListen.service';

// Possibilidade de renomear para repository

@Injectable()
export class KnexService extends KnexAuditListenService {
  private table: string;

  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(knex);
  }

  public setTableName(tableName: string) {
    this.table = tableName;
  }

  async create(data: any) {
    await this.knex.insert(data).into(this.table);
  }

  async update(id: string | number, data: any) {
    return await this.knex.update(data).where('id', id).into(this.table);
  }

  async updateWithAudit(id: string | number, data: any) {
    const tableName = this.table;
    this.eventEmitter.emit('startAudit', id, tableName);
    const result = await this.knex
      .update(data)
      .where('id', id)
      .into(this.table);
    this.eventEmitter.emit('finishAudit');
    return result;
  }
}
