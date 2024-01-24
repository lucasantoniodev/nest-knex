import { Injectable } from '@nestjs/common';
import { KnexRepository } from 'src/knex/knex.repository';

interface BookModel {
  id?: string;
  title: string;
  description: string;
}

@Injectable()
export class BooksService {
  constructor(private readonly knexRepository: KnexRepository) {
    this.knexRepository.setTableName('books', 'books_histora');
  }

  async create(data: any) {
    return this.knexRepository.createWithAudit(data);
  }

  async update(id: string, data: any) {
    return this.knexRepository.updateWithAudit(id, data);
  }

  async findAll() {
    return this.knexRepository.findAll();
  }

  async findById(id: string) {
    return this.knexRepository.findById(id);
  }

  async findByIdAndVersion(id: string, version: number) {
    return this.knexRepository.findByIdAndVersion(id, version);
  }

  async delete(id: string) {
    return this.knexRepository.deleteWithAudit(id);
  }
}
