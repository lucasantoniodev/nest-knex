import { Injectable, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './loggin.interceptor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KnexService } from './knex/knex.service';

interface BookModel {
  id?: string;
  title: string;
  description: string;
}

@Injectable()
export class AppService {
  constructor(private readonly knexService: KnexService) {
    this.knexService.setTableName('books');
  }

  async create() {
    return this.knexService.create({
      title: 'Título',
      description: 'Description',
    });
  }

  async update(id: string) {
    return this.knexService.updateWithAudit(id, {
      title: 'Título atualizado',
      description: 'Descrição atualizada',
    });
  }
}
