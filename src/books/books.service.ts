import { Injectable } from '@nestjs/common';
import { KnexRepository } from 'src/knex/knex.repository';

interface BookModel {
  id?: string;
  title: string;
  description: string;
}

@Injectable()
export class BooksService {
  constructor(private readonly knexService: KnexRepository) {
    this.knexService.setTableName('books', 'books_history');
  }

  async create(data: any) {
    return this.knexService.createWithAudit(data);
  }

  async update(id: string, data: any) {
    return this.knexService.updateWithAudit(id, data);
  }

  async findAll() {
    return this.knexService.findAll();
  }

  async findById(id: string) {
    return this.knexService.findById(id);
  }

  async findByIdAndVersion(id: string, version: number) {
    return this.knexService.findByIdAndVersion(id, version);
  }

  async delete(id: string) {
    return this.knexService.deleteWithAudit(id);
  }
}
