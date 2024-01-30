import { Module } from '@nestjs/common';
import { KnexAppModule } from 'src/knex/knex.module';
import { CreateCollectionFormController } from './controllers/createCollectionForm.controller';
import { CreateCollectionFormService } from './services/createCollectionForm.service';
import { CollectionFormRepository } from './repositories/collection-form.repository';

@Module({
  imports: [KnexAppModule],
  controllers: [CreateCollectionFormController],
  providers: [CreateCollectionFormService, CollectionFormRepository],
})
export class CollectionFormModule {}
